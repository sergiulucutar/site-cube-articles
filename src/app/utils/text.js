export const getContentAsWords = (element) => {
  const content = element.textContent.split(/\s/).map(word => `<span><span>${word}</span></span>`).join(' ')

  return content
}

export const getLines = (wordElements) => {
  const lines = [[]]
  let lineIndex = 0

  for (const word of wordElements) {
    if (lineIndex === 0 && lines[lineIndex].length === 0) {
      lines[lineIndex].push(word)
      continue
    }

    if (word.offsetTop !== lines[lineIndex][0].offsetTop) {
      lines.push([])
      lineIndex += 1
    }

    lines[lineIndex].push(word)
  }

  return lines
}

export const getLetters = element => {
  let content = ''

  for (const letter of element.textContent) {
    content += `<span>${letter}</span>`
  }

  return `<span>${content}</span>`
}
