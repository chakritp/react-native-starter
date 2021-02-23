import React, { isValidElement, ReactNode } from 'react'
import {
  ViewProps,
  View,
  TouchableWithoutFeedbackProps,
  TouchableHighlight,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { IconProp, renderIcon } from 'helpers/ui'
import { Text } from './Text'

export interface ListItemProps extends ViewProps {
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
  chevron?: boolean
  topDivider?: boolean
  bottomDivider?: boolean
  children?: ReactNode
  onPress?: TouchableWithoutFeedbackProps['onPress']
  onLongPress?: TouchableWithoutFeedbackProps['onLongPress']
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
  children,
  onPress,
  onLongPress
}: ListItemProps) => {
  const theme = useTheme()
  const styles = useStyles(themedStyles)

  const content = (
    <View style={[styles.container, style]}>
      {(leftIcon || leftContent) && (
        <View style={styles.leftContainer}>
          {leftIcon && (
            <View style={[styles.leftContentContainer, styles.leftIconContainer, leftContentContainerStyle]}>
              {renderIcon(leftIcon, { size: theme.fontSizes.xl, style: styles.icon })}
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
            {title && (isValidElement(title) ? title : <Text.P3 style={[styles.title, titleStyle]}>{title}</Text.P3>)}
            {subtitle && (isValidElement(subtitle) ? subtitle : <Text.P4 style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text.P4>)}
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
              {renderIcon(rightIcon, { size: theme.fontSizes.l, style: styles.icon })}
            </View>
          )}

          {chevron && (
            <View style={styles.rightContentContainer}>
              {renderIcon(chevron, { name: 'chevron-right', size: theme.fontSizes.l, style: styles.icon })}
            </View>
          )}
        </View>
      </View>
    </View>
  )

  if (onPress || onLongPress) {
    return (
      <TouchableHighlight
        accessible
        accessibilityRole="menuitem"
        underlayColor={theme.colors.listItemHighlightBg}
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

const themedStyles = createThemedStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing.l,
    backgroundColor: theme.colors.listItemBg
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 46,
    paddingRight: theme.spacing.s,
    borderColor: theme.colors.borderLight
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
    color: theme.colors.text
  },
  subtitle: {
    marginTop: theme.spacing.xxs,
    color: theme.colors.textMuted
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
  },
  icon: {
    color: theme.colors.textMuted
  }
}))
