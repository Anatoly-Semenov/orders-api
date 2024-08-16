import { Semaphore } from '../Semaphore'

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe('Semaphore', () => {
	const processCount = 2
	const util = new Semaphore('test', processCount)
	async function runOperation() {
		// Wait until lock is acquired to do anything
		const lock = await util.acquire()

		// Simulated operation that takes 1 second to finish
		await pause(1000)

		// Done with the resource now, release the lock to let others use it
		lock.release()
	}

	it('should have correct max number', () => {
		expect(util.max).toBe(processCount)
	})

	it('should not run next function', async () => {
		const promise1 = runOperation()
		const promise2 = runOperation()
		// @ts-ignore
		expect(util.running).toBe(processCount)
		await promise1
		await promise2
	})

	it('should run next function', async () => {
		await runOperation()
		const promise2 = runOperation()
		// @ts-ignore
		expect(util.running).toBe(1)
		await promise2
	})
})
