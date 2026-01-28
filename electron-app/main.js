const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const os = require('os');

// Load AWS credentials from the mikes.page profile
function getAWSCredentials() {
  const credentialsPath = path.join(os.homedir(), '.aws', 'credentials');
  const configPath = path.join(os.homedir(), '.aws', 'config');
  
  let accessKeyId, secretAccessKey, region = 'ap-southeast-2';
  
  try {
    const credentials = fs.readFileSync(credentialsPath, 'utf8');
    const profileMatch = credentials.match(/\[mikes\.page\]\s*\n\s*aws_access_key_id\s*=\s*(\S+)\s*\n\s*aws_secret_access_key\s*=\s*(\S+)/);
    if (profileMatch) {
      accessKeyId = profileMatch[1];
      secretAccessKey = profileMatch[2];
    }
  } catch (e) {
    console.error('Could not read AWS credentials:', e);
  }
  
  try {
    const config = fs.readFileSync(configPath, 'utf8');
    const regionMatch = config.match(/\[profile mikes\.page\]\s*[\s\S]*?region\s*=\s*(\S+)/);
    if (regionMatch) {
      region = regionMatch[1];
    }
  } catch (e) {
    // Use default region
  }
  
  return { accessKeyId, secretAccessKey, region };
}

const awsCreds = getAWSCredentials();
const s3Client = new S3Client({
  region: awsCreds.region,
  credentials: {
    accessKeyId: awsCreds.accessKeyId,
    secretAccessKey: awsCreds.secretAccessKey
  }
});

const BUCKET = 'mikes.page';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 600,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Bill Shorten - mikes.page'
  });

  mainWindow.loadFile('index.html');
  
  // Uncomment to open DevTools
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC Handlers
ipcMain.handle('create-short-link', async (event, { url, title }) => {
  try {
    // Get randoms file
    const getCommand = new GetObjectCommand({ Bucket: BUCKET, Key: 'randoms' });
    const response = await s3Client.send(getCommand);
    const randomsContent = await response.Body.transformToString();
    
    const lines = randomsContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) {
      throw new Error('No more short links available!');
    }
    
    const linkNumber = lines[0];
    const remainingLinks = lines.slice(1).join('\n');
    
    // Create the redirect HTML
    const htmlContent = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="../mikes.page.css">
        <meta property="og:image" content="../star.png" />
        <script type="text/javascript">
            window.location = "${url}";
        </script>  
    </head>
    <body>
        <img src="../star.png" alt="star"/>
        <br><br><br>
        <p><a href="https://mikelindner.com">by mikelindner.com</a></p>
    </body>
</html>`;

    // Upload the index.html
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: `${linkNumber}/index.html`,
      Body: htmlContent,
      ContentType: 'text/html'
    }));
    
    // Update randoms file
    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: 'randoms',
      Body: remainingLinks,
      ContentType: 'text/plain'
    }));
    
    const shortUrl = `https://mikes.page/${linkNumber}`;
    return { success: true, shortUrl, remaining: lines.length - 1 };
    
  } catch (error) {
    console.error('Error creating short link:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('copy-to-clipboard', async (event, text) => {
  clipboard.writeText(text);
  return true;
});

ipcMain.handle('get-remaining-count', async () => {
  try {
    const getCommand = new GetObjectCommand({ Bucket: BUCKET, Key: 'randoms' });
    const response = await s3Client.send(getCommand);
    const randomsContent = await response.Body.transformToString();
    const lines = randomsContent.split('\n').filter(line => line.trim());
    return { success: true, count: lines.length };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
