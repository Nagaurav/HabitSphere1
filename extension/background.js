
let activeTabId;
let startTime;
let activeUrl;
let userId = null; // We'll store the user ID here if available

// Initialize tracking when a tab becomes active
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  startTracking(tab);
});

// Update tracking when a tab's URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url && tabId === activeTabId) {
    startTracking(tab);
  }
});

function startTracking(tab) {
  if (activeTabId === tab.id) return;

  if (activeTabId) {
    stopTracking();
  }

  activeTabId = tab.id;
  activeUrl = new URL(tab.url).hostname;
  startTime = Date.now();
}

function stopTracking() {
  if (!activeTabId || !startTime) return;

  const endTime = Date.now();
  const timeSpent = Math.round((endTime - startTime) / 1000); // Convert to seconds

  // Retrieve userId from storage if available
  chrome.storage.local.get(['userId'], function(result) {
    userId = result.userId;
    
    // Send data to your Supabase backend
    fetch('https://qmdqruppbuyutasssggx.supabase.co/functions/v1/log-digital-usage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add your Supabase anon key here
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZHFydXBwYnV5dXRhc3NzZ2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Mzg4ODAsImV4cCI6MjA2MDIxNDg4MH0.23m4emgF1TsS3WOl5HP7quhjGzDqtbd7S08K6o9dBAk'
      },
      body: JSON.stringify({
        site_url: activeUrl,
        time_spent_seconds: timeSpent,
        user_id: userId || '00000000-0000-0000-0000-000000000000' // Default anonymous user if not logged in
      })
    }).catch(console.error);
  });

  activeTabId = null;
  startTime = null;
  activeUrl = null;
}

// Check for time limits every minute
chrome.alarms.create('checkTimeLimits', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkTimeLimits') {
    checkTimeLimits();
  }
});

async function checkTimeLimits() {
  if (!activeUrl) return;

  // Fetch time limits from storage and check if current site exceeds them
  const response = await fetch('https://qmdqruppbuyutasssggx.supabase.co/functions/v1/check-time-limits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZHFydXBwYnV5dXRhc3NzZ2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Mzg4ODAsImV4cCI6MjA2MDIxNDg4MH0.23m4emgF1TsS3WOl5HP7quhjGzDqtbd7S08K6o9dBAk'
    },
    body: JSON.stringify({
      site_url: activeUrl,
      user_id: userId || '00000000-0000-0000-0000-000000000000'
    })
  });

  const result = await response.json();
  
  if (result.limitExceeded) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'Time Limit Reached',
      message: `You've reached your daily limit for ${activeUrl}`
    });
  }
}

// Listen for messages from the popup to set the user ID
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SET_USER_ID') {
    userId = message.userId;
    chrome.storage.local.set({ userId: userId });
    sendResponse({ success: true });
  }
});
