const Palettes = {
  Wattle: {
    hex: '#cadc3c',
    normalRGB: [0.792, 0.862, 0.235]
  },
  Orange: {
    hex: '#FF5A21',
    normalRGB: [1, 0.352, 0.129]
  },
  'Caribbean Green': {
    hex: '#00CB97',
    normalRGB: [0, 0.796, 0.592]
  },
  Black: {
    hex: '#010001',
    normalRGB: [0.003, 0, 0.003]
  }
}

class Colors {
  getHexColor (paletteName) {
    document.body.style.backgroundColor = Palettes[paletteName] ? Palettes[paletteName].hex : Palettes.Black.hex
  }

  getNormalizedRGB (paletteName) {
    return Palettes[paletteName] ? Palettes[paletteName].normalRGB : Palettes.Black.normalRGB
  }
}

export const ColorsManager = new Colors()
