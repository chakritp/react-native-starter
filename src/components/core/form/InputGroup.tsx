import React, { isValidElement } from 'react'
import { View } from 'react-native'
import { createThemedStyleSheet, useStyles } from 'theme'
import { InputContainer } from './common'
import { Text } from '../Text'

export const InputGroup = ({
  horizontal,
  infoStyle,
  infoContainerStyle,
  info,
  infoPlacement = 'right',
  children,
  ...props
}) => {
  const styles = useStyles(themedStyles)
  const infoPlacementStyle = {
    alignItems: infoPlacement === 'center'
      ? 'center' : infoPlacement === 'right'
        ? 'flex-end' : 'flex-start'
  }

  return (
    <InputContainer {...props}>
      {horizontal ? (
        <View style={styles.horizontalWrapper}>
          {children}
        </View>
      ) : children}
      
      <View style={[styles.infoWrapper, infoPlacementStyle]}>
        {info != null && (
          <View style={[styles.infoContainer, infoContainerStyle]}>
            {isValidElement(info) ? info : <Text style={[styles.info, infoStyle]}>{info}</Text>}
          </View>
        )}
      </View>
    </InputContainer>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  horizontalWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  infoWrapper: {
    minHeight: theme.spacing.l,
    paddingBottom: theme.spacing.xs
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.spacing.l,
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.m
  },
  info: {
    fontSize: theme.fontSizes.xxs,
    color: theme.colors.textMuted
  }
}))
