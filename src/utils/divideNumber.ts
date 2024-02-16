export function divideNumber(initial: number, divideAmount: number) {
  console.log(initial)
  //   parseFloat((item / participant.messages.length).toFixed(2)))

  //   console.log((initial / divideAmount).toFixed(2))
  return parseFloat(((initial / divideAmount) * 100).toFixed(2))
}
