// Shared status -> badge color mappings for product requests and event bookings,
// used by both the customer account pages and the admin dashboard.

const PRODUCT_STATUS_STYLES = {
  PENDING: 'bg-gray-100 text-gray-700 border-gray-300',
  APPROVED: 'bg-[#6BCB77]/20 text-[#2D6A31] border-[#6BCB77]',
  REJECTED: 'bg-red-100 text-red-700 border-red-300',
  SHIPPED: 'bg-[#4D96FF]/20 text-[#1E4FA3] border-[#4D96FF]',
  DELIVERED: 'bg-[#9D4EDD]/20 text-[#5B2A82] border-[#9D4EDD]',
};

const EVENT_STATUS_STYLES = {
  PENDING: 'bg-gray-100 text-gray-700 border-gray-300',
  APPROVED: 'bg-[#6BCB77]/20 text-[#2D6A31] border-[#6BCB77]',
  WAITLISTED: 'bg-[#FFD93D]/30 text-[#8A6D00] border-[#FFD93D]',
  CANCELLED: 'bg-red-100 text-red-700 border-red-300',
};

export function productStatusClass(status) {
  return PRODUCT_STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 border-gray-300';
}

export function eventStatusClass(status) {
  return EVENT_STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 border-gray-300';
}
