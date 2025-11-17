# Region Dashboard Comprehensive User Guide

## Table of Contents

### Part 1: Quick Start
- [Getting Started in 5 Minutes](#getting-started-in-5-minutes)
- [Your First Dashboard](#your-first-dashboard)
- [Essential Actions](#essential-actions)

### Part 2: Core Features
- [Region Management](#region-management)
- [Region Customization](#region-customization)
- [Region Types Explained](#region-types-explained)

### Part 3: Advanced Features
- [Dashboard Controls](#dashboard-controls)
- [Layered UI System](#layered-ui-system)
- [Versioning System](#versioning-system)
- [Collaboration Features](#collaboration-features)
- [Sharing & Permissions](#sharing--permissions)

### Part 4: Productivity Features
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Undo/Redo System](#undoredo-system)
- [Export/Import Layouts](#exportimport-layouts)
- [Reset & Defaults](#reset--defaults)

### Part 5: Mobile & Responsive
- [Mobile Layout](#mobile-layout)
- [Touch Controls](#touch-controls)

### Part 6: Troubleshooting & Best Practices
- [Common Issues](#common-issues)
- [Best Practices](#best-practices)
- [Tips & Tricks](#tips--tricks)

### Part 7: Reference
- [Region Types Reference](#region-types-reference)
- [Keyboard Shortcuts Reference](#keyboard-shortcuts-reference)
- [API Reference](#api-reference-for-administrators)

---

# Part 1: Quick Start

## Getting Started in 5 Minutes

### What are Regions?

Regions are organized containers in your dashboard that hold widgets and content. Unlike the previous card system, regions are arranged in a structured grid layout that you can customize. Each region can be:

- **Moved** anywhere on the grid
- **Resized** to fit your needs
- **Collapsed** to save space
- **Locked** to prevent changes
- **Customized** with colors and titles
- **Shared** with specific users, roles, or teams

### Key Concepts

- **Grid Layout**: Regions snap to a grid system for clean organization
- **Auto-Save**: All changes save automatically after 500ms
- **Real-Time Collaboration**: See who else is viewing or editing
- **Version Control**: Create versions before major changes
- **Role-Based Defaults**: Start with templates for your role (Technician, Manager, Admin)

## Your First Dashboard

### Step 1: Navigate to Dashboard

1. Click on **Dashboard** in the main navigation
2. If this is your first time, you'll see an empty dashboard with a message: "No regions configured"

### Step 2: Add Your First Region

1. **Click the purple Settings button** (⚙️) in the top-left corner of the screen
2. In the settings panel that appears, click **"Add Region"**
3. A dialog will appear showing available region types
4. Select a region type (e.g., "Scheduling", "Reports", "Customer Search")
5. The region will appear in your dashboard grid at the next available position

**What you'll see:**
- A new region appears with a header showing the region type
- The region has resize handles (purple squares) on corners and edges
- A drag handle (⋮⋮) appears in the top-left when you hover over the header

### Step 3: Customize Your Region

1. **Click the Settings icon** (⚙️) in the region header
2. In the settings dialog:
   - Change the **Title** (up to 100 characters)
   - Select **Region Type** from the dropdown
   - Customize **Background Color**, **Header Color**, and **Border Color**
3. Click **"Save"** to apply changes

### Step 4: Arrange Your Layout

- **Move a region**: Click and drag the region header (⋮⋮ icon) to a new position
- **Resize a region**: Drag any of the purple resize handles on the corners or edges
- **Collapse a region**: Click the collapse button (▼) in the region header
- **Lock a region**: Click the lock button (🔒) to prevent accidental changes

## Essential Actions

### Adding Regions

**Method 1: Dashboard Settings Panel**
1. Click the purple Settings button (⚙️) in top-left
2. Click "Add Region"
3. Select a region type

**Method 2: Keyboard Shortcut**
- Press `Ctrl+K` (or `Cmd+K` on Mac) to open Command Palette
- Type "add region" and select the command
- Choose region type

**Method 3: Quick Number Keys**
- Press number keys `1-9` to quickly add common region types (when not typing in input fields)

### Moving Regions

**Drag and Drop:**
1. Hover over a region header
2. Click and hold the drag handle (⋮⋮ icon) that appears
3. Drag to the desired grid position
4. Release to drop

**What happens:**
- Other regions automatically shift to make room
- The grid layout prevents overlapping
- Changes save automatically

### Resizing Regions

1. Hover over a region to see resize handles
2. **Corner handles** (purple circles): Resize both width and height
3. **Edge handles** (purple rectangles): Resize width (left/right) or height (top/bottom)
4. Drag the handle to the desired size
5. Release to apply

**Constraints:**
- Regions have minimum size limits
- The grid enforces consistent spacing
- Very large regions may require scrolling the canvas

### Deleting Regions

1. Click the **More Options** button (⋮) in the region header
2. Select **"Delete"** from the context menu
3. Confirm the deletion

**Note:** Regions are soft-deleted and can be restored from version history.

---

# Part 2: Core Features

## Region Management

### Adding Regions

#### Available Region Types

When adding a region, you can choose from:

1. **Scheduling** - Calendar and schedule management
2. **Reports** - Report generation and viewing
3. **Customer Search** - Search and filter customers
4. **Settings** - Configuration options
5. **Quick Actions** - Common task shortcuts
6. **Analytics** - Data visualization and metrics
7. **Team Overview** - Team performance and status
8. **Financial Summary** - Financial data and summaries
9. **Custom** - Custom widget configuration

#### Adding Multiple Regions

You can add as many regions as needed. The system will:
- Place new regions at the next available grid position
- Automatically expand the canvas if needed
- Maintain proper spacing between regions

### Resizing Regions

#### Resize Handles

Regions have **8 resize handles**:
- **4 corner handles** (16px × 16px purple circles): Resize both dimensions
- **4 edge handles** (rectangular purple bars): Resize one dimension
  - Top/Bottom edges: Resize height
  - Left/Right edges: Resize width

#### Resize Behavior

- **Minimum Size**: Each region has a minimum width and height
- **Grid Snapping**: Resizing snaps to grid increments
- **Visual Feedback**: The handle highlights on hover (opacity 0.8)
- **Smooth Animation**: Resize operations are animated

#### Keyboard Resizing

While a region is selected:
- `Ctrl+Shift+Arrow Keys` - Move region
- `Alt+Arrow Keys` - Resize region (future feature)

### Moving/Reordering Regions

#### Drag and Drop

1. **Hover** over a region header to reveal the drag handle
2. **Click and hold** the drag handle (⋮⋮ icon)
3. **Drag** to the desired grid position
4. **Release** to drop

**Visual Feedback:**
- The region becomes semi-transparent while dragging
- A preview shows where it will be placed
- Other regions shift automatically

#### Swap Behavior

- If you drag a region onto another region's position, they **swap positions**
- This is enabled by default (`swapOnDrag={true}`)
- Prevents accidental overlapping

#### Collision Prevention

- The grid layout prevents regions from overlapping
- `preventCollision={true}` ensures clean organization
- Regions automatically adjust to maintain spacing

### Collapsing/Minimizing Regions

#### Collapse a Region

1. Click the **collapse button** (▼) in the region header
2. The region collapses to show only its header
3. The collapsed region is moved off-screen (to column 1000)
4. A minimized version appears in the **Minimized Region Dock** (top-right corner)

#### Minimized Region Dock

**Location:** Fixed position at top-right of screen (`top-4 right-4`)

**Features:**
- Shows all collapsed regions as compact cards
- Each card displays the region type name
- Click the **restore button** (⛶) to restore a region
- Horizontal scrolling if many regions are minimized
- Auto-hides when no regions are minimized

#### Restore a Region

**Method 1: From Dock**
1. Find the region in the Minimized Region Dock (top-right)
2. Click the restore button (⛶) on the region card
3. The region returns to its original position

**Method 2: From Header**
1. Click the expand button (▲) in a collapsed region's header
2. The region expands in place

### Locking Regions

#### Lock a Region

1. Click the **lock button** (🔒) in the region header
2. The button changes to a locked state (🔒)
3. The region border changes to red (`border-red-400`)
4. The region background becomes semi-transparent red (`bg-red-50/30`)

#### Locked Region Behavior

- **Cannot be moved** - Drag handle is disabled
- **Cannot be resized** - Resize handles are hidden
- **Cannot be deleted** - Delete option is disabled
- **Can be viewed** - Content remains visible
- **Can be unlocked** - Click lock button again

#### Use Cases

- Lock important regions to prevent accidental changes
- Lock regions during collaboration to indicate "do not edit"
- Lock regions before making major layout changes

### Duplicating Regions

#### Duplicate a Region

1. Click the **More Options** button (⋮) in the region header
2. Select **"Duplicate"** from the context menu
3. A new region is created with:
   - Same region type
   - Same configuration
   - Offset position (row+1, col+1)

**Visual Feedback:**
- Button shows "Duplicating..." while processing
- Success toast notification appears
- New region appears at offset position

#### Duplicate Behavior

- The duplicate includes all settings (colors, title, widget config)
- Position is automatically offset to avoid overlap
- You can immediately move/resize the duplicate

### Deleting Regions

#### Delete a Region

1. Click the **More Options** button (⋮) in the region header
2. Select **"Delete"** from the context menu
3. Confirm the deletion in the dialog

**What happens:**
- Region is **soft-deleted** (marked with `deleted_at` timestamp)
- Can be restored from version history
- Region disappears from view immediately
- Other regions maintain their positions

#### Restore a Deleted Region

1. Open **Version History** (from Dashboard FAB)
2. Find a version before the deletion
3. Click **"Revert"** to restore that version
4. The deleted region will reappear

## Region Customization

### Region Settings Dialog

#### Opening Settings

1. Click the **Settings icon** (⚙️) in the region header
2. The Region Settings Dialog appears as a modal overlay

#### Settings Options

**Title**
- Text input field (max 100 characters)
- Character counter appears when >80 characters
- Shows remaining characters: "X characters remaining"
- Default: Region type name (e.g., "Scheduling", "Customer Search")

**Region Type**
- Dropdown selector
- All available region types listed
- Changing type may affect available widgets

**Background Color**
- Color picker or text input
- Default: `rgb(255, 255, 255)` (white)
- Accepts hex, rgb, or named colors

**Header Color**
- Color picker or text input
- Default: `rgb(249, 250, 251)` (gray-50)
- Used for region header background

**Border Color**
- Color picker or text input
- Default: `rgb(229, 231, 235)` (gray-200)
- Used for region border

**Reset to Defaults**
- Button with rotate icon (↻)
- Resets all colors to defaults
- Does not reset title or type

#### Saving Settings

1. Make your changes
2. Click **"Save"** button (bottom-right)
3. Dialog closes and changes apply immediately
4. Success toast notification appears

**Error Handling:**
- If save fails, error toast appears
- Settings dialog remains open
- You can retry or cancel

### Visual Styling

#### Color Customization

**Best Practices:**
- Use light backgrounds for readability
- Maintain sufficient contrast (WCAG AA)
- Use consistent color schemes across related regions
- Consider your organization's brand colors

**Color Format:**
- RGB: `rgb(255, 255, 255)`
- Hex: `#ffffff`
- Named: `white` (limited support)

#### Region Header

The region header displays:
- **Drag Handle** (⋮⋮) - Left side, appears on hover
- **Title** - Center, truncated if too long
- **Action Buttons** - Right side:
  - Collapse (▼/▲)
  - Lock (🔒/🔓)
  - More Options (⋮)
  - Settings (⚙️)
  - Delete (×)

#### Region Content Area

- Padding: `p-4` (16px) for enterprise standards
- Scrollable if content exceeds region height
- Minimum height enforced by `min_height` property

## Region Types Explained

### Scheduling
**Purpose:** Calendar and schedule management
**Use Cases:**
- View daily/weekly/monthly schedules
- Manage appointments
- Track technician availability

### Reports
**Purpose:** Report generation and viewing
**Use Cases:**
- Generate custom reports
- View pre-built report templates
- Export report data

### Customer Search
**Purpose:** Search and filter customers
**Use Cases:**
- Quick customer lookup
- Advanced search with filters
- Customer history and details

### Settings
**Purpose:** Configuration options
**Use Cases:**
- Application settings
- User preferences
- System configuration

### Quick Actions
**Purpose:** Common task shortcuts
**Use Cases:**
- One-click actions (create job, add customer)
- Frequently used operations
- Workflow shortcuts

### Analytics
**Purpose:** Data visualization and metrics
**Use Cases:**
- Performance dashboards
- KPI tracking
- Trend analysis
- Charts and graphs

### Team Overview
**Purpose:** Team performance and status
**Use Cases:**
- Team member status
- Performance metrics
- Workload distribution

### Financial Summary
**Purpose:** Financial data and summaries
**Use Cases:**
- Revenue tracking
- Financial reports
- Budget monitoring

### Custom
**Purpose:** Custom widget configuration
**Use Cases:**
- Third-party widgets
- Custom integrations
- Specialized functionality

---

# Part 3: Advanced Features

## Dashboard Controls

### Dashboard FAB (Floating Action Button)

**Location:** Top-left corner (`top-4 left-4`)

**Appearance:**
- Purple circular button with Settings icon (⚙️)
- 48px × 48px size
- Shadow and hover effects
- Rotates 180° when panel is open

#### Opening the Settings Panel

1. Click the purple Settings button
2. Settings panel slides in from the left
3. Panel appears at `left-32` (128px from left edge)
4. Backdrop overlay appears (10% black opacity)

#### Settings Panel Contents

**Add Region Button**
- Purple button with Plus icon
- Opens region type selector dialog
- Same as "Add Region" in main interface

**Collaboration Status**
- Shows connection status (Connected/Disconnected)
- WiFi icon (green = connected, red = disconnected)
- Toggle button to connect/disconnect
- Displays active collaborators count

**Undo/Redo Controls**
- Two buttons side-by-side
- Undo button (left) - Reverts last action
- Redo button (right) - Reapplies undone action
- Buttons disabled when no history available
- Gray background, purple on hover

**Export/Import Layout**
- Export button: Downloads layout as JSON file
- Import button: Opens file picker for JSON files
- File format: JSON with regions array
- Validates file structure on import

**Zoom Controls**
- Current zoom level display (e.g., "Zoom: 100%")
- Three buttons:
  - Zoom Out (-) - Decreases zoom
  - Reset (↻) - Returns to 100% zoom
  - Zoom In (+) - Increases zoom
- Buttons disabled at zoom limits

**Reset All Button**
- Red button with warning styling
- Resets zoom/pan and loads default layout
- Requires confirmation dialog
- **Warning:** Cannot be undone

**Fullscreen Toggle**
- Green button
- Toggles fullscreen mode
- Shows "Enter Fullscreen" or "Exit Fullscreen"
- Maximize/Minimize icons

#### Closing the Settings Panel

- Click the X button in panel header
- Click the backdrop overlay
- Click the Settings FAB button again

### Zoom and Pan

#### Zoom Controls

**Zoom In**
- Click "+" button in Dashboard FAB
- Or use keyboard shortcut (see Keyboard Shortcuts)
- Maximum zoom: 200% (configurable)

**Zoom Out**
- Click "-" button in Dashboard FAB
- Or use keyboard shortcut
- Minimum zoom: 25% (configurable)

**Reset Zoom**
- Click "Reset" (↻) button in Dashboard FAB
- Returns to 100% zoom
- Also resets pan position

#### Pan Controls

**Mouse Panning**
1. Click and hold anywhere on the canvas (not on a region)
2. Drag to pan the view
3. Release to stop panning

**Visual Feedback:**
- Cursor changes to "grabbing" hand
- Canvas moves smoothly
- Regions maintain their positions

**Pan Limits:**
- Cannot pan beyond canvas boundaries
- Automatically constrained to visible area

#### Canvas Rendering

**Optimization:**
- `imageRendering: 'crisp-edges'` for sharp rendering
- `willChange: 'transform'` for hardware acceleration
- Smooth 60fps animations

### Fullscreen Mode

#### Enter Fullscreen

1. Click "Enter Fullscreen" in Dashboard FAB
2. Or use browser fullscreen (F11)
3. Dashboard expands to fill entire screen
4. Mobile: Optimized vertical layout

#### Exit Fullscreen

1. Click "Exit Fullscreen" in Dashboard FAB
2. Or press Escape key
3. Or use browser exit fullscreen (F11)

**Mobile Fullscreen:**
- Hides browser UI
- Optimized for touch interaction
- Vertical region stacking

## Layered UI System

### Command Palette

**Keyboard Shortcut:** `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac)

#### Opening the Command Palette

1. Press `Ctrl+K` / `Cmd+K` from anywhere in the dashboard
2. A modal overlay appears with search input
3. Start typing to search commands

#### Command Palette Features

**Search Input**
- Real-time filtering as you type
- Highlights matching text
- Shows command count

**Command List**
- Filtered list of available commands
- Keyboard navigation (Arrow keys)
- Enter to execute
- Escape to close

**Available Commands**
- Add Region
- Toggle Collaboration
- Export Layout
- Import Layout
- Reset All
- Toggle Fullscreen
- Show Keyboard Shortcuts
- And more...

#### Using the Command Palette

1. Open with `Ctrl+K` / `Cmd+K`
2. Type command name (e.g., "add region")
3. Use Arrow keys to navigate results
4. Press Enter to execute
5. Or click a command with mouse

**Tips:**
- Partial matching works (e.g., "add" finds "Add Region")
- Commands are categorized
- Recently used commands appear first

### Floating Navigation Bar

**Location:** Top of dashboard (below header)

#### Features

**Search Bar**
- Search regions by type or title
- Real-time filtering
- Clear button (×) to reset

**Filter Buttons**
- Active filter: Shows active regions
- Locked filter: Shows locked regions
- Click to toggle filter
- Multiple filters can be active

**View Options**
- Toggle grid visibility
- Toggle region labels
- View mode selector

### Utility Dock

**Location:** Configurable (default: visible)

**Toggle:**
- Show/hide utility dock
- Persists preference
- Contains utility tools

**Contents:**
- Quick actions
- Tool shortcuts
- Context-sensitive tools

### Inspector Panel

**Purpose:** View and edit region properties

#### Opening Inspector

1. Right-click a region
2. Select "Inspect" from context menu
3. Or use Command Palette: "Show Inspector"

#### Inspector Contents

**Region Properties**
- ID
- Type
- Position (row, col)
- Size (row_span, col_span)
- Lock status
- Collapse status

**Configuration**
- Widget type
- Widget config (JSON view)
- Custom settings

**Permissions**
- ACL list
- Shared with (users, roles, teams)
- Permission levels

**Metadata**
- Created date
- Updated date
- Last modified by

#### Editing in Inspector

- Some properties are editable inline
- Changes save automatically
- JSON config can be edited (with validation)

## Versioning System

### Creating Versions

#### When to Create Versions

- Before making major layout changes
- After completing a set of changes
- Before sharing with team
- As backup points

#### Create a Version

1. Make your dashboard changes
2. Open **Version History** (from Dashboard FAB or Command Palette)
3. Click **"Create Version"**
4. Fill in version details:
   - **Status**: Draft, Preview, or Published
   - **Notes**: Optional description
5. Click **"Create"**

#### Version Statuses

**Draft**
- Work in progress
- Only visible to you
- Can be edited or deleted

**Preview**
- Ready for review
- Visible to team members
- Can be tested before publishing

**Published**
- Active version
- Visible to all users with access
- Only one published version at a time

### Publishing Versions

#### Publish a Version

1. Open Version History
2. Find the version you want to publish
3. Click **"Publish"** button
4. Add publish notes (optional)
5. Confirm publication

**What happens:**
- Previous published version becomes "Archived"
- New version becomes active
- All users see the new layout
- Change is logged in audit trail

### Reverting Changes

#### Revert to Previous Version

1. Open Version History
2. Browse versions (oldest to newest)
3. Select the version to restore
4. Click **"Revert"** button
5. Confirm the revert

**What happens:**
- Current layout is replaced with selected version
- A new version is created (for history)
- All regions return to their previous state
- Changes are immediately visible

#### Version Comparison

**View Differences:**
1. Select two versions in Version History
2. Click **"Compare"**
3. Diff view shows:
   - Added regions (green)
   - Removed regions (red)
   - Modified regions (yellow)
   - Unchanged regions (gray)

## Collaboration Features

### Real-Time Presence

#### Presence Indicators

**Viewing Indicators**
- User avatars appear on regions being viewed
- Tooltip shows user name
- Updates in real-time

**Editing Indicators**
- Yellow highlight on regions being edited
- Lock icon appears
- User name displayed

#### Connection Status

**Connected State**
- Green WiFi icon in Dashboard FAB
- "Connected" status text
- Real-time updates enabled

**Disconnected State**
- Red WiFi icon
- "Disconnected" status text
- Falls back to polling

#### Collaborator List

**View Active Collaborators**
1. Open Dashboard FAB
2. See collaborator count in Collaboration Status
3. Click to expand list
4. See names and avatars

### Region Locking (Collaboration)

#### Soft Locking

**How it works:**
- When you start editing a region, a soft lock is acquired
- Other users see the lock indicator
- Lock expires after 5 minutes of inactivity
- Automatically released when you finish editing

#### Conflict Resolution

**Editing Conflicts:**
- If someone else is editing, you'll see a conflict alert
- Options:
  - Wait for them to finish
  - Request to take over
  - Work on a different region

**Automatic Resolution:**
- Locks expire after 5 minutes
- System detects stale locks
- Auto-releases inactive locks

### Multi-User Editing

#### Best Practices

1. **Communicate** - Let team know when making major changes
2. **Use Versions** - Create versions before major edits
3. **Lock Important Regions** - Lock critical regions during editing
4. **Work in Sections** - Different users edit different regions
5. **Check Presence** - Look for presence indicators before editing

#### Conflict Alerts

**When conflicts occur:**
- Alert appears at top of screen
- Shows who is editing
- Options to resolve
- Can dismiss if not critical

---

# Part 4: Productivity Features

## Keyboard Shortcuts

### Navigation Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `W` | Navigate Up | Move focus to region above |
| `S` | Navigate Down | Move focus to region below |
| `A` | Navigate Left | Move focus to region on left |
| `D` | Navigate Right | Move focus to region on right |
| `Tab` | Next Region | Move to next region in sequence |
| `Shift+Tab` | Previous Region | Move to previous region |
| `Home` | First Region | Jump to first region |
| `End` | Last Region | Jump to last region |
| `Space` | Activate | Select/activate focused region |
| `Enter` | Activate | Select/activate focused region |
| `Escape` | Deselect | Clear selection |

### Region Action Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+D` | Duplicate | Duplicate selected region(s) |
| `Delete` | Delete | Delete selected region(s) |
| `Ctrl+L` | Lock/Unlock | Toggle lock on selected region |
| `Ctrl+C` | Collapse | Collapse selected region |
| `Ctrl+E` | Expand | Expand collapsed region |
| `Ctrl+S` | Settings | Open region settings |

### Dashboard Control Shortcuts

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl+K` / `Cmd+K` | Command Palette | Open command palette |
| `Ctrl+Z` | Undo | Undo last action |
| `Ctrl+Shift+Z` | Redo | Redo undone action |
| `Ctrl+R` | Reset View | Reset zoom and pan |
| `F11` | Fullscreen | Toggle fullscreen mode |
| `?` | Help | Show keyboard shortcuts |

### Quick Region Creation

| Key | Region Type |
|-----|-------------|
| `1` | Scheduling |
| `2` | Reports |
| `3` | Customer Search |
| `4` | Settings |
| `5` | Quick Actions |
| `6` | Analytics |
| `7` | Team Overview |
| `8` | Financial Summary |
| `9` | Custom |

**Note:** Number keys only work when not typing in input fields.

### Modifier Keys

- **Ctrl** (Windows/Linux) or **Cmd** (Mac) - Primary modifier
- **Shift** - Multi-select, extend selection
- **Alt** - Alternative actions (future)

### Keyboard Navigation Tips

1. **Focus Management**: Use Tab to move between regions
2. **Quick Actions**: Number keys for fast region creation
3. **Command Palette**: `Ctrl+K` is your friend - use it often
4. **Undo/Redo**: `Ctrl+Z` and `Ctrl+Shift+Z` for safety
5. **Escape**: Always closes dialogs and clears selection

## Undo/Redo System

### How It Works

**History Management:**
- Tracks up to 50 state changes
- Saves state after each action
- Debounced (500ms) to avoid excessive saves
- Automatically clears old history when limit reached

### Using Undo/Redo

#### Undo an Action

**Method 1: Keyboard**
- Press `Ctrl+Z` (Windows/Linux) or `Cmd+Z` (Mac)

**Method 2: Dashboard FAB**
1. Open Dashboard FAB (top-left)
2. Click "Undo" button
3. Button disabled if nothing to undo

#### Redo an Action

**Method 1: Keyboard**
- Press `Ctrl+Shift+Z` (Windows/Linux) or `Cmd+Shift+Z` (Mac)

**Method 2: Dashboard FAB**
1. Open Dashboard FAB
2. Click "Redo" button
3. Button disabled if nothing to redo

### What Can Be Undone

**Supported Actions:**
- Add region
- Delete region
- Move region
- Resize region
- Change region settings
- Collapse/expand region
- Lock/unlock region

**Not Supported:**
- Version operations (create, publish, revert)
- Import/export operations
- Reset all (requires confirmation)

### Limitations

- **History Limit**: Only last 50 actions
- **Page Refresh**: History is lost on page reload
- **Collaboration**: Undo only affects your local changes
- **Versioning**: Use versioning for permanent history

## Export/Import Layouts

### Export Layout

#### Export Your Dashboard

1. Open **Dashboard FAB** (top-left)
2. In settings panel, find "Layout" section
3. Click **"Export"** button
4. JSON file downloads automatically
5. File named: `dashboard-layout-YYYY-MM-DD.json`

#### Export File Format

```json
{
  "layoutId": "uuid",
  "regions": [
    {
      "id": "region-uuid",
      "region_type": "scheduling",
      "grid_row": 0,
      "grid_col": 0,
      "row_span": 4,
      "col_span": 6,
      "config": {
        "title": "My Schedule",
        "backgroundColor": "rgb(255, 255, 255)",
        "headerColor": "rgb(249, 250, 251)",
        "borderColor": "rgb(229, 231, 235)"
      },
      "widget_type": "calendar",
      "widget_config": {}
    }
  ],
  "exportedAt": "2024-01-15T10:30:00Z",
  "version": "1.0"
}
```

#### Use Cases for Export

- **Backup**: Save your layout before major changes
- **Sharing**: Share layouts with team members
- **Migration**: Move layouts between environments
- **Templates**: Create reusable layout templates

### Import Layout

#### Import a Dashboard

1. Open **Dashboard FAB**
2. In settings panel, find "Layout" section
3. Click **"Import"** button
4. File picker opens
5. Select JSON file (`.json` extension)
6. File is validated and imported

#### Import Validation

**Checks:**
- Valid JSON format
- Required fields present
- Region data structure valid
- No duplicate region IDs

**On Success:**
- Regions are imported
- Layout replaces current layout
- Success toast notification
- Regions appear immediately

**On Error:**
- Error toast with details
- Current layout unchanged
- Check file format and try again

#### Import File Requirements

**Required Fields:**
- `regions` array (can be empty)
- Each region must have:
  - `id` (string, UUID)
  - `region_type` (string, valid type)
  - `grid_row`, `grid_col` (numbers)
  - `row_span`, `col_span` (numbers)

**Optional Fields:**
- `config` object
- `widget_type`, `widget_config`
- `is_collapsed`, `is_locked`

#### Import Behavior

**What Happens:**
- Current regions are replaced (not merged)
- Imported regions use their exact positions
- Settings and configurations are preserved
- Widget configs are applied

**Best Practices:**
- Export current layout before importing
- Validate JSON file before importing
- Test import in preview environment first
- Keep backup of working layouts

## Reset & Defaults

### Reset All

#### Reset Your Dashboard

1. Open **Dashboard FAB** (top-left)
2. Scroll to bottom of settings panel
3. Click **"Reset All"** button (red, with warning icon)
4. Confirmation dialog appears
5. Click **"Confirm"** to proceed

**Warning:** This action cannot be undone!

#### What Reset All Does

1. **Resets Zoom/Pan**
   - Zoom returns to 100%
   - Pan position resets to center
   - Canvas view returns to default

2. **Loads Default Layout**
   - Loads role-based default layout
   - Replaces all current regions
   - Applies default configuration

3. **Clears History**
   - Undo/redo history is cleared
   - Cannot undo the reset

#### When to Use Reset All

- Starting fresh with a clean layout
- Recovering from a corrupted layout
- Testing default configurations
- Resetting after experimentation

### Role-Based Defaults

#### Available Defaults

**Technician Default**
- Optimized for field technicians
- Common regions: Scheduling, Quick Actions, Customer Search
- Mobile-friendly layout

**Manager Default**
- Optimized for managers
- Common regions: Analytics, Team Overview, Reports
- Comprehensive dashboard

**Admin Default**
- Optimized for administrators
- Common regions: Settings, Analytics, Financial Summary
- Full feature access

#### Loading Default Layout

**Method 1: Reset All**
- Reset All automatically loads your role's default

**Method 2: Manual Load**
1. Open Command Palette (`Ctrl+K`)
2. Type "load default"
3. Select your role's default
4. Confirm replacement

#### Customizing Defaults

**For Administrators:**
- Defaults are configured in `roleDefaults.ts`
- Can be modified per organization
- Requires code changes (contact developer)

---

# Part 5: Mobile & Responsive

## Mobile Layout

### Responsive Behavior

**Screen Size Detection:**
- Automatically detects mobile devices
- Switches to mobile layout below breakpoint
- Maintains desktop layout on tablets (landscape)

**Breakpoints:**
- Mobile: < 768px width
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Vertical Stacking

**Mobile Layout:**
- Regions stack vertically (one per row)
- No side-by-side regions
- Full width for each region
- Maintains order from desktop layout

**Spacing:**
- Consistent padding between regions
- Touch-friendly spacing (minimum 16px)
- Scrollable vertical list

### Hidden Regions

**Mobile Visibility:**
- Regions with `is_hidden_mobile: true` are hidden
- Useful for desktop-only features
- Reduces clutter on small screens

**Setting Mobile Visibility:**
1. Open Region Settings
2. Toggle "Hide on Mobile" option
3. Save settings

## Touch Controls

### Touch Gestures

**Tap**
- Select region
- Open region settings
- Activate buttons

**Long Press**
- Opens context menu
- Alternative to right-click

**Swipe**
- Scroll regions list
- Pan canvas (when enabled)

**Pinch to Zoom**
- Zoom in/out on canvas
- Two-finger gesture
- Smooth zoom animation

### Touch-Optimized UI

**Button Sizes:**
- Minimum 44px × 44px (Apple HIG)
- Adequate spacing between buttons
- Large touch targets

**Region Headers:**
- Larger tap areas
- Clear visual feedback
- Hover states replaced with active states

### Fullscreen Mode

#### Mobile Fullscreen

**Enter Fullscreen:**
1. Tap "Enter Fullscreen" in Dashboard FAB
2. Browser UI hides
3. Dashboard fills entire screen
4. Optimized for mobile interaction

**Exit Fullscreen:**
1. Tap "Exit Fullscreen" button
2. Or swipe down from top (browser gesture)
3. Browser UI returns

**Benefits:**
- More screen real estate
- Immersive experience
- Better for presentations

---

# Part 6: Troubleshooting & Best Practices

## Common Issues

### Region Not Loading

**Symptoms:**
- Region appears but content is blank
- Loading spinner never completes
- Error message displayed

**Solutions:**

1. **Check Internet Connection**
   - Verify network connectivity
   - Check if other regions load
   - Try refreshing the page

2. **Refresh the Page**
   - Press `F5` or `Ctrl+R`
   - Hard refresh: `Ctrl+Shift+R` (clears cache)
   - Reloads all regions

3. **Check Browser Console**
   - Open Developer Tools (`F12`)
   - Check Console tab for errors
   - Look for network errors (404, 500, etc.)
   - Report errors to administrator

4. **Check Region Configuration**
   - Open Region Settings
   - Verify widget type is set
   - Check widget config is valid
   - Try changing widget type

5. **Check Permissions**
   - Verify you have read access
   - Check if region is shared with you
   - Contact region owner if needed

### Can't Edit Region

**Symptoms:**
- Buttons are disabled
- Can't move or resize
- Settings dialog won't open

**Solutions:**

1. **Check Lock Status**
   - Look for lock icon (🔒) in header
   - If locked, click lock to unlock
   - Check if someone else has it locked

2. **Check Permissions**
   - Verify you have edit permissions
   - Check ACL settings in Region Settings
   - Contact region owner for access

3. **Check Collaboration Status**
   - Look for presence indicators
   - See if someone else is editing
   - Wait for them to finish or request access

4. **Check Connection**
   - Verify collaboration is connected (green WiFi icon)
   - Try disconnecting and reconnecting
   - Check network connectivity

### Performance Issues

**Symptoms:**
- Slow region loading
- Laggy interactions
- High CPU usage
- Browser becomes unresponsive

**Solutions:**

1. **Lazy Loading**
   - Regions load as you scroll
   - Scroll to load more regions
   - Reduces initial load time

2. **Reduce Region Count**
   - Too many regions can slow performance
   - Consider collapsing unused regions
   - Remove unnecessary regions

3. **Check Widget Performance**
   - Some widgets are heavier than others
   - Check Analytics dashboard for metrics
   - Consider lighter alternatives

4. **Browser Optimization**
   - Close other tabs
   - Clear browser cache
   - Update browser to latest version
   - Disable browser extensions

5. **Hardware Acceleration**
   - Ensure hardware acceleration is enabled
   - Check browser settings
   - Update graphics drivers

### Collaboration Conflicts

**Symptoms:**
- Conflict alerts appear
- Can't edit region
- Lock indicators show

**Solutions:**

1. **Wait for Lock Release**
   - Locks expire after 5 minutes
   - Wait for other user to finish
   - Check presence indicators

2. **Request Access**
   - Click "Request Access" in conflict alert
   - Sends notification to current editor
   - They can release the lock

3. **Work on Different Region**
   - Edit a different region
   - Avoid conflicts by working separately
   - Coordinate with team members

4. **Check Connection**
   - Ensure collaboration is connected
   - Reconnect if disconnected
   - Check network stability

### Import/Export Errors

**Symptoms:**
- Import fails with error
- Export file is invalid
- Regions don't import correctly

**Solutions:**

1. **Validate JSON Format**
   - Check file is valid JSON
   - Use JSON validator online
   - Fix syntax errors

2. **Check File Structure**
   - Verify required fields present
   - Check region data format
   - Compare with export example

3. **Check File Size**
   - Very large files may fail
   - Split into smaller exports
   - Remove unnecessary data

4. **Version Compatibility**
   - Ensure export version matches
   - Check for breaking changes
   - Use compatible versions

## Best Practices

### Layout Organization

1. **Group Related Regions**
   - Place related regions together
   - Use consistent positioning
   - Create visual hierarchy

2. **Use Consistent Sizing**
   - Similar regions should be similar sizes
   - Maintain grid alignment
   - Avoid extreme size differences

3. **Leave Breathing Room**
   - Don't pack regions too tightly
   - Use appropriate spacing
   - Consider visual balance

4. **Prioritize Important Regions**
   - Place critical regions at top-left
   - Larger regions for important content
   - Collapse less-used regions

### Performance Optimization

1. **Limit Region Count**
   - Too many regions slow performance
   - Aim for 10-15 regions maximum
   - Use collapsing for organization

2. **Lazy Loading**
   - Regions load as needed
   - Scroll to trigger loading
   - Reduces initial load time

3. **Optimize Widgets**
   - Use lightweight widgets when possible
   - Avoid heavy computations
   - Cache data when appropriate

4. **Monitor Performance**
   - Check Analytics dashboard
   - Monitor load times
   - Identify bottlenecks

### Collaboration Etiquette

1. **Communicate Changes**
   - Let team know before major changes
   - Use version notes
   - Coordinate editing sessions

2. **Respect Locks**
   - Don't force unlock regions
   - Wait for locks to expire
   - Request access politely

3. **Use Versions**
   - Create versions before major changes
   - Test in preview before publishing
   - Document changes in notes

4. **Check Presence**
   - Look for presence indicators
   - Avoid editing same region simultaneously
   - Work in different areas

### Version Management

1. **Create Versions Frequently**
   - Before major changes
   - After completing features
   - As backup points

2. **Use Descriptive Notes**
   - Explain what changed
   - Reference tickets/issues
   - Include date and reason

3. **Test Before Publishing**
   - Use Preview status first
   - Get team feedback
   - Fix issues before publishing

4. **Maintain History**
   - Don't delete old versions
   - Keep important milestones
   - Archive instead of delete

### Security Considerations

1. **Review Permissions**
   - Regularly audit ACLs
   - Remove unnecessary access
   - Follow principle of least privilege

2. **Lock Sensitive Regions**
   - Lock regions with sensitive data
   - Prevent accidental changes
   - Use appropriate permissions

3. **Monitor Access**
   - Check who has access
   - Review audit logs
   - Report suspicious activity

## Tips & Tricks

### Keyboard Navigation Efficiency

1. **Master Command Palette**
   - `Ctrl+K` is your best friend
   - Learn common commands
   - Use it for everything

2. **Use Number Keys**
   - Quick region creation
   - Memorize common types
   - Faster than clicking

3. **WASD Navigation**
   - Natural movement keys
   - Faster than mouse
   - Great for power users

4. **Undo/Redo Frequently**
   - Don't be afraid to experiment
   - Undo is always available
   - Try different layouts

### Region Organization Patterns

1. **Dashboard Zones**
   - Top: Overview/Metrics
   - Middle: Main content
   - Bottom: Details/History
   - Side: Navigation/Actions

2. **Color Coding**
   - Use colors to group regions
   - Different colors for different functions
   - Maintain consistency

3. **Size Hierarchy**
   - Larger = more important
   - Smaller = supporting info
   - Create visual flow

4. **Collapse Strategy**
   - Collapse less-used regions
   - Keep important ones expanded
   - Use dock for organization

### Widget Selection

1. **Match Widget to Need**
   - Choose appropriate widget type
   - Consider data requirements
   - Think about use case

2. **Test Widgets**
   - Try different widgets
   - See what works best
   - Optimize configuration

3. **Custom Widgets**
   - Use Custom type for special needs
   - Configure widget_config carefully
   - Test thoroughly

### Workflow Optimization

1. **Use Templates**
   - Create layout templates
   - Export successful layouts
   - Share with team

2. **Keyboard Shortcuts**
   - Learn all shortcuts
   - Create muscle memory
   - Work faster

3. **Batch Operations**
   - Make multiple changes
   - Then create version
   - More efficient workflow

4. **Regular Maintenance**
   - Clean up unused regions
   - Update configurations
   - Optimize layout

---

# Part 7: Reference

## Region Types Reference

### Complete List

| Type | Key | Description | Use Cases |
|------|-----|-------------|-----------|
| Scheduling | `scheduling` | Calendar and schedule management | Daily schedules, appointments, availability |
| Reports | `reports` | Report generation and viewing | Custom reports, templates, exports |
| Customer Search | `customer-search` | Search and filter customers | Quick lookup, advanced search, history |
| Settings | `settings` | Configuration options | App settings, preferences, system config |
| Quick Actions | `quick-actions` | Common task shortcuts | One-click actions, workflows |
| Analytics | `analytics` | Data visualization and metrics | Dashboards, KPIs, trends, charts |
| Team Overview | `team-overview` | Team performance and status | Member status, metrics, workload |
| Financial Summary | `financial-summary` | Financial data and summaries | Revenue, reports, budgets |
| Custom | `custom` | Custom widget configuration | Third-party widgets, integrations |

### Region Type Details

#### Scheduling
- **Widget Types**: Calendar, Schedule List, Timeline
- **Common Config**: Date range, filters, view mode
- **Data Sources**: Jobs, appointments, technician schedules

#### Reports
- **Widget Types**: Report List, Report Builder, Report Viewer
- **Common Config**: Report type, date range, filters
- **Data Sources**: Various (jobs, customers, financial, etc.)

#### Customer Search
- **Widget Types**: Search Bar, Customer List, Customer Details
- **Common Config**: Search fields, filters, sort options
- **Data Sources**: Customer database

#### Settings
- **Widget Types**: Settings Panel, Preference Editor
- **Common Config**: Section, category
- **Data Sources**: User preferences, system settings

#### Quick Actions
- **Widget Types**: Action Buttons, Shortcut Grid
- **Common Config**: Action list, button layout
- **Data Sources**: Available actions/permissions

#### Analytics
- **Widget Types**: Chart, Graph, Metric Card, KPI Dashboard
- **Common Config**: Metric type, time range, aggregation
- **Data Sources**: Various (performance, financial, operational)

#### Team Overview
- **Widget Types**: Team List, Status Board, Performance Grid
- **Common Config**: Team selection, metrics, view mode
- **Data Sources**: Team data, user data, performance metrics

#### Financial Summary
- **Widget Types**: Financial Chart, Summary Card, Transaction List
- **Common Config**: Account selection, date range, currency
- **Data Sources**: Financial data, transactions, budgets

#### Custom
- **Widget Types**: Any (configured via widget_config)
- **Common Config**: Varies by widget
- **Data Sources**: Varies by widget

## Keyboard Shortcuts Reference

### Complete Shortcuts Table

#### Navigation
| Shortcut | Action | Context |
|----------|--------|---------|
| `W` | Navigate Up | Region focused |
| `S` | Navigate Down | Region focused |
| `A` | Navigate Left | Region focused |
| `D` | Navigate Right | Region focused |
| `Tab` | Next Region | Anywhere |
| `Shift+Tab` | Previous Region | Anywhere |
| `Home` | First Region | Anywhere |
| `End` | Last Region | Anywhere |
| `Space` | Activate | Region focused |
| `Enter` | Activate | Region focused |
| `Escape` | Deselect | Anywhere |

#### Region Actions
| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+D` / `Cmd+D` | Duplicate | Region selected |
| `Delete` | Delete | Region selected |
| `Ctrl+L` / `Cmd+L` | Lock/Unlock | Region selected |
| `Ctrl+C` / `Cmd+C` | Collapse | Region selected |
| `Ctrl+E` / `Cmd+E` | Expand | Region selected |
| `Ctrl+S` / `Cmd+S` | Settings | Region selected |

#### Dashboard Controls
| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+K` / `Cmd+K` | Command Palette | Anywhere |
| `Ctrl+Z` / `Cmd+Z` | Undo | Anywhere |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo | Anywhere |
| `Ctrl+R` / `Cmd+R` | Reset View | Anywhere |
| `F11` | Fullscreen | Anywhere |
| `?` | Help | Anywhere |

#### Quick Region Creation
| Key | Region Type | Context |
|-----|-------------|---------|
| `1` | Scheduling | Not in input |
| `2` | Reports | Not in input |
| `3` | Customer Search | Not in input |
| `4` | Settings | Not in input |
| `5` | Quick Actions | Not in input |
| `6` | Analytics | Not in input |
| `7` | Team Overview | Not in input |
| `8` | Financial Summary | Not in input |
| `9` | Custom | Not in input |

### Shortcut Categories

**Navigation**: Movement between regions
**Actions**: Operations on regions
**Controls**: Dashboard-level operations
**Creation**: Quick region creation
**System**: Browser/system shortcuts

## API Reference (For Administrators)

### Layout Endpoints

#### Get or Create Default Layout
```
GET /api/dashboard/layouts/default
POST /api/dashboard/layouts/default
```
Returns or creates default layout for user.

#### Get Layout
```
GET /api/dashboard/layouts/:layoutId
```
Returns layout with all regions.

#### Update Layout
```
PUT /api/dashboard/layouts/:layoutId
```
Updates layout metadata.

### Region Endpoints

#### List Regions
```
GET /api/dashboard/layouts/:layoutId/regions
```
Returns all regions for a layout.

#### Create Region
```
POST /api/dashboard/layouts/:layoutId/regions
Body: {
  region_type: string,
  grid_row: number,
  grid_col: number,
  row_span: number,
  col_span: number,
  config: object,
  widget_type?: string,
  widget_config?: object
}
```

#### Update Region
```
PUT /api/dashboard/layouts/:layoutId/regions/:regionId
Body: Partial<DashboardRegion>
```

#### Delete Region
```
DELETE /api/dashboard/layouts/:layoutId/regions/:regionId
```
Soft deletes region.

#### Reorder Regions
```
POST /api/dashboard/layouts/:layoutId/regions/reorder
Body: { regionIds: string[] }
```

#### Get Role Defaults
```
GET /api/dashboard/regions/defaults/:role
```
Returns default regions for role (technician, manager, admin).

### Version Endpoints

#### List Versions
```
GET /api/dashboard/layouts/:layoutId/versions
```
Returns version history.

#### Create Version
```
POST /api/dashboard/layouts/:layoutId/versions
Body: {
  status: 'draft' | 'preview' | 'published',
  notes?: string
}
```

#### Publish Version
```
POST /api/dashboard/layouts/:layoutId/publish
Body: {
  versionId: string,
  notes?: string
}
```

#### Revert to Version
```
POST /api/dashboard/layouts/:layoutId/revert/:versionId
```

### Collaboration Endpoints

#### Get Presence
```
GET /api/dashboard/regions/:regionId/presence
```
Returns active viewers/editors.

#### Acquire/Release Lock
```
POST /api/dashboard/regions/:regionId/lock
Body: { action: 'acquire' | 'release' }
```

### ACL Endpoints

#### Get Region ACLs
```
GET /api/dashboard/regions/:regionId/acls
```

#### Share Region
```
POST /api/dashboard/regions/:regionId/share
Body: {
  targetType: 'user' | 'role' | 'team',
  targetId: string,
  permissions: string[]
}
```

#### Update ACL
```
PUT /api/dashboard/regions/:regionId/acls/:aclId
Body: { permissions: string[] }
```

#### Remove ACL
```
DELETE /api/dashboard/regions/:regionId/acls/:aclId
```

### Authentication

All endpoints require:
- Valid authentication token
- Tenant context (automatically set)
- Appropriate permissions (checked via RLS)

### Error Responses

**400 Bad Request**: Invalid input data
**401 Unauthorized**: Missing or invalid token
**403 Forbidden**: Insufficient permissions
**404 Not Found**: Resource doesn't exist
**500 Internal Server Error**: Server error

### Rate Limiting

- 100 requests per minute per user
- 1000 requests per hour per user
- Exceeded limits return 429 Too Many Requests

---

## Support & Additional Resources

### Getting Help

- **Documentation**: Check this guide and architecture docs
- **System Administrator**: Contact for permissions and configuration
- **Audit Logs**: Review change history in admin panel
- **Error Logs**: Check browser console (F12) for errors

### Related Documentation

- [Architecture Documentation](../DASHBOARD_REGIONS.md) - Technical details
- [Widget SDK Guide](../developer/WIDGET_SDK.md) - Creating custom widgets
- [Security Guide](../security/WIDGET_SECURITY.md) - Security best practices

### Feedback

If you find issues or have suggestions:
1. Document the issue clearly
2. Include steps to reproduce
3. Note your role and permissions
4. Contact your system administrator

---

**Last Updated**: 2024-01-15
**Version**: 2.0
**Author**: VeroField Documentation Team
