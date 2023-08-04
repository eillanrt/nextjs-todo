export function formatMongooseTimestamp(dateStr) {
  return new Date(dateStr).toDateString().split(' ').slice(1).join(' ')
}
