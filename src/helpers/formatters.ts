export const formatCreditCardNumber = (value: string) => {
  let digits = value.split('')
  const digitGroups = []
  for (let i = 0; i < digits.length; i += 4) {
    digitGroups.push(digits.slice(i, i + 4).join(''))
  }
  return digitGroups.join(' ')
}
