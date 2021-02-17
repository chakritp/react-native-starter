import React, { ReactNode } from 'react'
import { View, StyleSheet, StyleProp, TextStyle, ViewStyle } from 'react-native'
import { Text } from 'components/core'

export const IMAGE_URI_1 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5O97UmEt73MwLcpjFeoteuDitpLc2RFVARw8jJJ2FI9HkyXgh&s'
export const IMAGE_URI_2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgCvlJ0VhLBYzrNdLTaPc3JEYQjuczU45c6ih2hXf32z0iyzsmSQ&s'

export const Label = ({ style, children }: { style?: StyleProp<TextStyle>, children?: ReactNode }) => (
  <Text style={[styles.label, style]}>{children}</Text>
);

export const Section = ({ style, label, children }: { style?: StyleProp<ViewStyle>, label?: string, children?: ReactNode }) => (
  <View style={[styles.section, style]}>
    {label && <Label>{label}</Label>}
    {children}
  </View>
);

const styles = StyleSheet.create({
  label: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 12,
    color: '#333'
  },
  section: {
  }
})
