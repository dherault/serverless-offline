// [0, 1, 2, 3, 4 ,5] => [[0, 1], [2, 3], [4, 5]]
// (value: Array<any>, size: number) => Array<Array<any>>
export default function unflatten(value, size) {
  const { length } = value

  // array should be multiple of size
  if (length % size > 0) {
    throw new Error(
      `Function 'unflatten' has not the right amount of items. Array length ${length} has to be multiple of ${size}`,
    )
  }

  const unflattened = []

  for (let i = 0; i < value.length; i += size) {
    const slice = value.slice(i, i + size)
    unflattened.push(slice)
  }

  return unflattened
}
