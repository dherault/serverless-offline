// [0, 1, 2, 3, 4 ,5] => [[0, 1], [2, 3], [4, 5]]

export default function unflatten<T>(value: T[], size: 1): [T][]
export default function unflatten<T>(value: T[], size: 2): [T, T][]
export default function unflatten<T>(value: T[], size: 3): [T, T, T][]
export default function unflatten<T>(value: T[], size: 4): [T, T, T, T][]
export default function unflatten<T>(value: T[], size: 5): [T, T, T, T, T][]
export default function unflatten<T>(value: T[], size: 6): [T, T, T, T, T, T][]

export default function unflatten<T>(value: T[], size: number): T[][] {
  const unflattened = []

  for (let i = 0; i < value.length; i += size) {
    const slice = value.slice(i, i + size)
    unflattened.push(slice)
  }

  return unflattened
}
