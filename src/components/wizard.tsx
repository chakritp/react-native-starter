import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useHeaderHeight } from '@react-navigation/stack'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import {
  ScrollContainer,
  Text,
  Button,
  Badge,
  Heading,
} from 'components/core'
import { t } from 'helpers/i18n'
import { renderIcon } from 'helpers/ui'

export const WizardContainer = ({
  contentContainerStyle,
  screenHeader,
  icon,
  title,
  subtitle,
  children,
  keyboard = true,
  ...props
}) => {
  const styles = useStyles(themedStyles)
  const headerHeight = useHeaderHeight()
  
  return (
    <ScrollContainer
      paddingHorizontal="xxl"
      center
      keyboard={keyboard}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[
        styles.contentContainer,
        !screenHeader && { paddingTop: headerHeight },
        contentContainerStyle
      ]}
      {...props}>
      <Heading icon={icon} title={title} subtitle={subtitle} />
      {children}
    </ScrollContainer>
  )
}

export const SectionHeader = ({ style, title }) => {
  const styles = useStyles(themedStyles)
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text.P2 style={styles.sectionHeaderTitle}>
        {title}
      </Text.P2>
    </View>
  )
}

export const NavOption = ({ number, icon = "chevron-right", title, description, children, onPress }) => {
  const styles = useStyles(themedStyles)
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={styles.navOption}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.s }}>
          {number && (
            <Badge style={{ marginTop: 1, marginRight: theme.spacing.s }} size="xs" color="info" textColor="white">
              {number}
            </Badge>
          )}
          <Text.H3 color="infoMuted">{title}</Text.H3>
        </View>
        {renderIcon(icon, { style: { marginTop: 1, marginRight: -6, marginLeft: 'auto' }, size: 26 })}
      </View>
      {description ? <Text.C1>{description}</Text.C1> : null}
      {children}
    </TouchableOpacity>
  )
}

export const SubmitButton = ({ style, form, title = t('actions.submit'), ...props }) => {
  const styles = useStyles(themedStyles)
  return (
    <Button
      style={[styles.submitButton, style]}
      title={title}
      loading={form && form.formState.isSubmitting}
      onPress={form && form.submit}
      {...props} />
  )
}

export const SecondaryButton = ({ style, ...props }) => {
  const styles = useStyles(themedStyles)
  return (
    <Button
      style={[styles.secondaryButton, style]}
      variant="secondary"
      size="s"
      {...props} />
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  contentContainer: {
    paddingVertical: theme.spacing.xxl
  },
  sectionHeader: {
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.xxl,
    borderColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeaderTitle: {
    marginBottom: theme.spacing.m,
  },
  input: {
    ...theme.fonts.bodyRegular,
    fontSize: theme.fontSizes.m
  },
  navOption: {
    marginBottom: theme.spacing.xxl,
  },
  submitButton: {
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.xl
  },
  secondaryButton: {
    alignSelf: 'center',
    minWidth: '40%',
    marginBottom: theme.spacing.l
  }
}))
