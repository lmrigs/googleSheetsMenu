
/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

document.addEventListener("DOMContentLoaded", function() {
    // your code here
    renderData();
    document.getElementById('authorize_button').style.visibility = 'hidden';
    //show sing out btn 
    document.getElementById('signout_button').style.visibility = 'visible';
  });
  

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '325873793787-gijv43akk9qk3sfq7nju728kf0vrusik.apps.googleusercontent.com';
const API_KEY = 'AIzaSyAlV0w34KhnNO6Wa5LhfCiWfag516ekSU4';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

/**document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    const token = localStorage.getItem('access_token');
    if (token) {
        // Set the token for the API client
        gapi.client.setToken({ access_token: token });
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });

        console.log(gapi.client, "token")
    } else {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: [DISCOVERY_DOC],
        });
        console.log(gapi.client, "not token")

    }
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
//@todo change the name of the function to be clear this is oAuth stuff
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 *  Sign in the user upon button click.
 */
async function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        const { access_token } = resp.access_token;
        localStorage.setItem('access_token', resp.access_token); // Store the access token in local storage
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        await listMajors();
    };
    if (localStorage.getItem('access_token') === null || localStorage.getItem('access_token') === '') { //check the local storage
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else if (localStorage.getItem('access_token')) {
        // Skip display of account chooser and consent dialog for an existing session.
        //   tokenClient.requestAccessToken({prompt: ''});
        //hide the auth btn 
        document.getElementById('authorize_button').style.visibility = 'hidden';
        //show sing out btn 
        document.getElementById('signout_button').style.visibility = 'visible';
        //show spreeedsheat data
        renderData();
    };
};




/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

// Print the names and majors of students in a sample spreadsheet:
// https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit


async function listMajors() {
    let response;
    try {
        // Fetch first 10 files
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
            range: 'Class Data!A2:E',
        });
        // Assuming your data is stored in a variable named "data"
        localStorage.setItem("dish_values", JSON.stringify(response.result));
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }
    renderData();
}

function renderData() {
    let data = localStorage.getItem("dish_values");
    data = JSON.parse(data);
    if (!data.values || data.values.length == 0) {
        document.getElementById('content').innerText = 'No values found.';
        return;
    }
    // Flatten to string to display
    const output = data.values.reduce(
        (str, row) => `${str}${row[0]}, ${row[4]}\n`,
        'Name, Major:\n');
    document.getElementById('content').innerText = output;
 
}


