# Delivery Notification & Order History Fixes

## Files to Modify

### 1. src/admin/orders.js
- **Line 44**: Change `/schedule` → `/update`

### 2. src/screens/MyOrder.js
- **Line 71**: Remove forced 'delivered'
- **Lines 72-73**: Show delivery date/time for ALL orders
- **Lines 122-127**: Add status colors (pending, scheduled, preparing)
- **Line 134**: Show scheduled info for all non-final statuses
- **Add new**: Real-time polling every 12 seconds
- **Update**: Notification message format

## Implementation Order
1. Fix API endpoint in admin panel
2. Fix Order History display issues
3. Add real-time auto-update polling