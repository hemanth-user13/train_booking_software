function randomPNR(): string {
  // First digit is never 0, like real PNRs.
  let pnr = String(Math.floor(1 + Math.random() * 9))
  for (let i = 0; i < 9; i++) pnr += Math.floor(Math.random() * 10)
  return pnr
}

/** Returns a 10 digit PNR that does not clash with any existing one. */
export function generatePNR(existingPnrs: string[]): string {
  const taken = new Set(existingPnrs)
  let pnr = randomPNR()
  while (taken.has(pnr)) pnr = randomPNR()
  return pnr
}
