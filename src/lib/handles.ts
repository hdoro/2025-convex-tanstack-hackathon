/**
 * Example return: hke-cbrc-pjk
 */
export function createRoomHandle() {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'

	const segment1 = Array.from(
		{ length: 3 },
		() => chars[Math.floor(Math.random() * chars.length)],
	).join('')
	const segment2 = Array.from(
		{ length: 4 },
		() => chars[Math.floor(Math.random() * chars.length)],
	).join('')
	const segment3 = Array.from(
		{ length: 3 },
		() => chars[Math.floor(Math.random() * chars.length)],
	).join('')

	return `${segment1}-${segment2}-${segment3}`
}
