<script lang="ts">
  import { onMount } from 'svelte';
  import { userStore, authReady } from '../../stores/user.store';
  import { timeEntriesService } from '../services/time-entries.service';
  import type { TimeEntry } from '../types';

  let timeEntries: TimeEntry[] = [];
  let loading = false;
  let error = '';
  let success = '';
  let clockedIn = false;
  let currentEntryId: number | null = null;
  let elapsedTime = '00:00:00';

  let user: any;
  let currentTime = new Date();

  userStore.subscribe((value: any) => {
    user = value;
  });

  let intervalId: ReturnType<typeof setInterval>;

  onMount(async () => {
    if (!$authReady) {
      return;
    }

    await loadTodayEntries();

    // Update time every second
    intervalId = setInterval(() => {
      currentTime = new Date();
      if (clockedIn && currentEntryId) {
        updateElapsedTime();
      }
    }, 1000);
  });

  onMount(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  });

  async function loadTodayEntries() {
    try {
      loading = true;
      const entries = await timeEntriesService.getMyTodayEntries();
      timeEntries = entries;

      // Check if currently clocked in
      const activeEntry = entries.find((e: TimeEntry) => !e.exitTime);
      if (activeEntry) {
        clockedIn = true;
        currentEntryId = activeEntry.id;
      } else {
        clockedIn = false;
        currentEntryId = null;
      }
    } catch (err: any) {
      error = err.message || 'Failed to load time entries';
    } finally {
      loading = false;
    }
  }

  function updateElapsedTime() {
    if (!clockedIn || !currentEntryId) return;

    const activeEntry = timeEntries.find((e) => e.id === currentEntryId);
    if (!activeEntry) return;

    const entryTime = new Date(activeEntry.entryTime);
    const diff = currentTime.getTime() - entryTime.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elapsedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  async function handleClockIn() {
    try {
      error = '';
      success = '';
      loading = true;

      if (!user || !user.id || !user.departmentId) {
        throw new Error('User information missing');
      }

      const entry = await timeEntriesService.recordEntry(user.id, user.departmentId);
      timeEntries = [entry, ...timeEntries];
      clockedIn = true;
      currentEntryId = entry.id;
      success = 'Clocked in successfully';
      elapsedTime = '00:00:00';

      setTimeout(() => {
        success = '';
      }, 3000);
    } catch (err: any) {
      error = err.message || 'Failed to clock in';
    } finally {
      loading = false;
    }
  }

  async function handleClockOut() {
    try {
      error = '';
      success = '';
      loading = true;

      if (!currentEntryId) {
        throw new Error('No active time entry');
      }

      const updatedEntry = await timeEntriesService.recordExit(currentEntryId);
      timeEntries = timeEntries.map((e) => (e.id === updatedEntry.id ? updatedEntry : e));
      clockedIn = false;
      currentEntryId = null;
      success = 'Clocked out successfully';
      elapsedTime = '00:00:00';

      setTimeout(() => {
        success = '';
      }, 3000);
    } catch (err: any) {
      error = err.message || 'Failed to clock out';
    } finally {
      loading = false;
    }
  }

  function formatTime(date: Date | string) {
    return new Date(date).toLocaleTimeString();
  }

  function calculateDuration(entry: TimeEntry) {
    if (!entry.exitTime) return 'In progress...';
    const start = new Date(entry.entryTime);
    const end = new Date(entry.exitTime);
    const diff = end.getTime() - start.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  }
</script>

<div class="time-tracking-container">
  <div class="header">
    <h1>Time Tracking</h1>
    <p class="current-time">{currentTime.toLocaleTimeString()}</p>
  </div>

  {#if error}
    <div class="alert alert-error">
      {error}
    </div>
  {/if}

  {#if success}
    <div class="alert alert-success">
      {success}
    </div>
  {/if}

  <div class="clock-section">
    <div class="clock-display">
      <div class="time">{elapsedTime}</div>
      <div class="status">{clockedIn ? 'Clocked In' : 'Clocked Out'}</div>
    </div>

    <div class="button-group">
      <button
        class="btn btn-primary"
        disabled={clockedIn || loading}
        on:click={handleClockIn}
      >
        {loading ? 'Processing...' : 'Clock In'}
      </button>
      <button
        class="btn btn-danger"
        disabled={!clockedIn || loading}
        on:click={handleClockOut}
      >
        {loading ? 'Processing...' : 'Clock Out'}
      </button>
    </div>
  </div>

  <div class="history-section">
    <h2>Today's Entries</h2>
    {#if loading}
      <p class="loading">Loading entries...</p>
    {:else if timeEntries.length === 0}
      <p class="no-entries">No time entries for today</p>
    {:else}
      <table class="entries-table">
        <thead>
          <tr>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {#each timeEntries as entry (entry.id)}
            <tr class={entry.exitTime ? '' : 'active'}>
              <td>{formatTime(entry.entryTime)}</td>
              <td>{entry.exitTime ? formatTime(entry.exitTime) : 'In Progress'}</td>
              <td>{calculateDuration(entry)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</div>

<style>
  .time-tracking-container {
    padding: 2rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .header h1 {
    margin: 0;
  }

  .current-time {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
  }

  .alert {
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .alert-error {
    background: #fee;
    color: #c00;
    border: 1px solid #fcc;
  }

  .alert-success {
    background: #efe;
    color: #060;
    border: 1px solid #cfc;
  }

  .clock-section {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .clock-display {
    margin-bottom: 1.5rem;
  }

  .time {
    font-size: 3.5rem;
    font-weight: bold;
    font-family: 'Courier New', monospace;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .status {
    font-size: 1.2rem;
    color: #666;
  }

  .button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.3s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #4caf50;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #45a049;
  }

  .btn-danger {
    background: #f44336;
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background: #da190b;
  }

  .history-section {
    margin-top: 2rem;
  }

  .history-section h2 {
    margin: 0 0 1rem 0;
  }

  .loading,
  .no-entries {
    text-align: center;
    color: #666;
    padding: 1rem;
  }

  .entries-table {
    width: 100%;
    border-collapse: collapse;
  }

  .entries-table th,
  td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  .entries-table th {
    background: #f5f5f5;
    font-weight: 600;
  }

  .entries-table tr.active {
    background: #f0f8ff;
  }

  .entries-table tr:hover {
    background: #f9f9f9;
  }
</style>
