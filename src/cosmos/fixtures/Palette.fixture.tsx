import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ScrollContainer, Text } from 'components/core'
import palette from 'theme/palette'

interface HueMap {
  [key: string]: {
    levels: { name: string, color: string }[]
  }
}

export default () => {
  const hues = Object.entries(palette).reduce((acc: HueMap, [name, color]) => {
    const hue = name.replace(/\d/g, '')
    const level = name.slice(hue.length)
    acc[hue] || (acc[hue] = { levels: [] })
    acc[hue].levels.push({ name: level, color })
    return acc
  }, {})

  return (
    <ScrollContainer safe padding="l">
      {Object.keys(hues).map(hue => (
        <View key={hue}>
          <Text>{hue}</Text>
          <View style={styles.row}>
            {hues[hue].levels.map(({ name, color }) => (
              <View key={name} style={styles.cell}>
                <View style={[styles.swatch, { backgroundColor: color }]} />
                {name ? <Text variant="c2">{name}</Text> : null}
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollContainer>
  )
}

const styles = StyleSheet.create({
  row: {
    marginTop: 5,
    flexDirection: 'row'
  },
  cell: {
    width: 30,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  swatch: {
    width: 32,
    height: 32,
    borderColor: 'white',
    borderWidth: StyleSheet.hairlineWidth
  }
})
