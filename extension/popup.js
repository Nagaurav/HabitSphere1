
document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const loginView = document.getElementById('login-view');
  const statsView = document.getElementById('stats-view');
  const userIdInput = document.getElementById('user-id');
  const loginBtn = document.getElementById('login-btn');
  const currentSite = document.getElementById('current-site');
  const siteCategory = document.getElementById('site-category');
  const timeSpent = document.getElementById('time-spent');
  const blockDistracting = document.getElementById('block-distracting');
  const showNotifications = document.getElementById('show-notifications');
  const viewDashboardBtn = document.getElementById('view-dashboard-btn');

  // Check if user is logged in
  chrome.storage.local.get(['userId'], function(result) {
    if (result.userId) {
      userIdInput.value = result.userId;
      showStatsView();
    }
  });

  // Login button click handler
  loginBtn.addEventListener('click', function() {
    const userId = userIdInput.value.trim();
    if (userId) {
      // Send message to background script to set user ID
      chrome.runtime.sendMessage({
        type: 'SET_USER_ID',
        userId: userId
      }, function(response) {
        if (response.success) {
          showStatsView();
        }
      });
    }
  });

  // Toggle settings handlers
  blockDistracting.addEventListener('change', function() {
    chrome.storage.local.set({ blockDistracting: this.checked });
  });
  
  showNotifications.addEventListener('change', function() {
    chrome.storage.local.set({ showNotifications: this.checked });
  });
  
  // Load settings
  chrome.storage.local.get(['blockDistracting', 'showNotifications'], function(result) {
    blockDistracting.checked = result.blockDistracting || false;
    showNotifications.checked = result.showNotifications !== false; // Default to true
  });

  // View dashboard button
  viewDashboardBtn.addEventListener('click', function() {
    chrome.tabs.create({ url: "https://1e008a3d-1f47-4569-83bf-d639684a175f.lovableproject.com/digital-habits" });
  });

  function showStatsView() {
    loginView.style.display = 'none';
    statsView.style.display = 'block';
    updateCurrentSiteInfo();
  }

  function updateCurrentSiteInfo() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length > 0) {
        const url = new URL(tabs[0].url);
        currentSite.textContent = url.hostname;
        
        // Check site category
        checkSiteCategory(url.hostname);
        
        // Get time spent on this site today
        getTimeSpent(url.hostname);
      }
    });
  }
  
  function checkSiteCategory(hostname) {
    chrome.storage.local.get(['userId'], function(result) {
      const userId = result.userId || '00000000-0000-0000-0000-000000000000';
      
      fetch('https://qmdqruppbuyutasssggx.supabase.co/functions/v1/check-time-limits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZHFydXBwYnV5dXRhc3NzZ2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Mzg4ODAsImV4cCI6MjA2MDIxNDg4MH0.23m4emgF1TsS3WOl5HP7quhjGzDqtbd7S08K6o9dBAk'
        },
        body: JSON.stringify({
          site_url: hostname,
          user_id: userId
        })
      })
      .then(response => response.json())
      .then(data => {
        siteCategory.textContent = data.category.charAt(0).toUpperCase() + data.category.slice(1);
        siteCategory.className = 'category ' + data.category;
      })
      .catch(error => {
        console.error('Error checking site category:', error);
        siteCategory.textContent = 'Unknown';
        siteCategory.className = 'category neutral';
      });
    });
  }
  
  function getTimeSpent(hostname) {
    chrome.storage.local.get(['todayUsage'], function(result) {
      const usage = result.todayUsage || {};
      const seconds = usage[hostname] || 0;
      
      timeSpent.textContent = formatTime(seconds);
    });
  }
  
  function formatTime(seconds) {
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} min`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }
});
