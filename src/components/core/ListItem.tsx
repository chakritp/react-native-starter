import React, { isValidElement, ReactNode } from 'react'
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native'
import { createThemedStyles, useThemedStyles } from 'lib/restyle'
import { IconProp, renderIcon } from 'helpers/ui'
import { Theme, ThemeColor, ThemeSize } from 'theme'
import { Box, BoxProps, TouchableHighlight, TouchableHighlightProps } from './common'
import { Text } from './Text'

export interface ListItemProps extends BoxProps {
  leftContentContainerStyle?: StyleProp<ViewStyle>
  titleContainerStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  subtitleStyle?: StyleProp<TextStyle>
  title?: string | ReactNode
  subtitle?: string | ReactNode
  leftContent?: ReactNode
  leftIcon?: IconProp
  rightContent?: ReactNode
  rightIcon?: IconProp
  chevron?: boolean | IconProp
  topDivider?: boolean
  bottomDivider?: boolean
  accessibilityLabel?: string
  children?: ReactNode
  onPress?: TouchableHighlightProps['onPress']
  onLongPress?: TouchableHighlightProps['onLongPress']
}

export const ListItem = ({
  style,
  leftContentContainerStyle,
  titleContainerStyle,
  titleStyle,
  subtitleStyle,
  title,
  subtitle,
  leftContent,
  leftIcon,
  rightContent,
  rightIcon,
  chevron,
  topDivider,
  bottomDivider,
  accessibilityLabel,
  children,
  onPress,
  onLongPress,
  ...props
}: ListItemProps) => {
  const styles = useThemedStyles(themedStyles)

  const content = (
    <Box style={[styles.container, style]} {...props}>
      {(leftIcon || leftContent) && (
        <View style={styles.leftContainer}>
          {leftIcon && (
            <View style={[styles.leftContentContainer, styles.leftIconContainer, leftContentContainerStyle]}>
              {renderIcon(leftIcon, { ...defaultIconProps, size: 'xl' })}
            </View>
          )}
          {leftContent && (
            <View style={[styles.leftContentContainer, leftContentContainerStyle]}>
              {leftContent}
            </View>
          )}
        </View>
      )}

      <View
        style={[
          styles.innerContainer,
          topDivider && { borderTopWidth: StyleSheet.hairlineWidth },
          bottomDivider && { borderBottomWidth: StyleSheet.hairlineWidth },
        ]}>
        {(title || subtitle) && (
          <View style={[styles.titleContainer, titleContainerStyle]}>
            {title && (isValidElement(title) ? title : <Text variant="p3" style={[styles.title, titleStyle]}>{title}</Text>)}
            {subtitle && (isValidElement(subtitle) ? subtitle : <Text variant="p4" style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>)}
          </View>
        )}

        {children}

        <View style={styles.rightContainer}>
          {rightContent && (
            <View style={styles.rightContentContainer}>
              {rightContent}
            </View>
          )}

          {rightIcon && (
            <View style={styles.rightContentContainer}>
              {renderIcon(rightIcon, defaultIconProps)}
            </View>
          )}

          {chevron && (
            <View style={styles.rightContentContainer}>
              {renderIcon(chevron as any, { ...defaultIconProps, name: 'chevron-right' })}
            </View>
          )}
        </View>
      </View>
    </Box>
  )

  if (onPress || onLongPress) {
    return (
      <TouchableHighlight
        accessible
        accessibilityRole="menuitem"
        accessibilityLabel={accessibilityLabel}
        underlayColor="mainBackgroundMedium"
        onPress={onPress}
        onLongPress={onLongPress}
      >
        {content}
      </TouchableHighlight>
    )
  }

  return content
}

export const InputListItem = (props: ListItemProps) => (
  <ListItem titleContainerStyle={{ width: '33%' }} {...props} />
)

const defaultIconProps = {
  size: 'l' as ThemeSize,
  color: 'mainForegroundMuted' as ThemeColor
}

const themedStyles = createThemedStyles((theme: Theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing.l,
    backgroundColor: theme.colors.mainBackgroundHeavy
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    paddingRight: theme.spacing.s,
    borderColor: theme.colors.mainBorderMuted
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftIconContainer: {
    width: theme.sizes.m,
    marginLeft: -theme.spacing.xs
  },
  leftContentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 42,
    paddingRight: theme.spacing.m
  },
  titleContainer: {
    justifyContent: 'center',
    marginRight: theme.spacing.m,
    paddingVertical: 8,
  },
  title: {
    color: theme.colors.mainForegroundRegular
  },
  subtitle: {
    marginTop: theme.spacing.xxs,
    color: theme.colors.mainForegroundMuted
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto'
  },
  rightContentContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 34,
    paddingLeft: theme.spacing.m,
  }
}))
