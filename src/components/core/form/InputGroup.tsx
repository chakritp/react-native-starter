import React, { isValidElement, ReactNode } from 'react'
import { StyleProp, View, TextStyle, ViewStyle, ViewProps } from 'react-native'
import { createThemedStyleSheet, useStyles } from 'theme'
import { Text } from '../Text'
import { Label } from './Label'

export interface InputGroupProps extends ViewProps {
  labelStyle?: StyleProp<ViewStyle>
  labelTextStyle?: StyleProp<TextStyle>
  infoStyle?: StyleProp<ViewStyle>
  infoTextStyle?: StyleProp<TextStyle>
  inline?: boolean
  infoPlacement?: 'left' | 'center' | 'right'
  label?: string | ReactNode
  info?: string | ReactNode
  children?: ReactNode
}

export const InputGroup = ({
  labelStyle,
  labelTextStyle,
  infoStyle,
  infoTextStyle,
  inline,
  infoPlacement = 'right',
  label,
  info,
  children,
  ...props
}: InputGroupProps) => {
  const styles = useStyles(themedStyles)
  const infoPlacementStyle: StyleProp<ViewStyle> = {
    alignItems: infoPlacement === 'center'
      ? 'center' : infoPlacement === 'right'
        ? 'flex-end' : 'flex-start'
  }

  const content = (
    <>
      {label !== undefined && (
        isValidElement(label) ? label : (
          <Label style={labelStyle} textStyle={labelTextStyle} inline={inline}>{label}</Label>
        )
      )}
      {children}
    </>
  )

  return (
    <View {...props}>
      {inline ? (
        <View style={styles.inlineWrapper}>
          {content}
        </View>
      ) : content}
      
      <View style={[styles.infoWrapper, infoPlacementStyle]}>
        {info !== undefined && (
          <View style={[styles.info, infoStyle]}>
            {isValidElement(info) ? info : <Text style={[styles.infoText, infoTextStyle]}>{info}</Text>}
          </View>
        )}
      </View>
    </View>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  inlineWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoWrapper: {
    minHeight: theme.spacing.l,
    paddingBottom: theme.spacing.xs
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.spacing.l,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.m
  },
  infoText: {
    fontSize: theme.fontSizes.xxs,
    color: theme.colors.textMuted
  }
}))
