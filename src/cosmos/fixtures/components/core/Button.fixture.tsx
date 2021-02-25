import React from 'react'
import { useValue } from 'react-cosmos/fixture'
import { useTheme } from '@shopify/restyle'
import { Label } from 'cosmos/ui'
import { Box, ScrollContainer, ButtonProps, Button as $Button } from 'components/core'
import { Theme } from 'theme'

export default () => {
  const theme = useTheme()
  const variants = Object.keys(theme.buttonVariants).filter(v => v !== 'defaults')
  const [title] = useValue('title', { defaultValue: "Bump" })
  const [loading] = useValue('loading', { defaultValue: false })

  return (
    <ScrollContainer
      safe="top"
      contentPadding="m"
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-around' }}
    >
      <ButtonSizeRow title={title} loading={loading} />
      <ButtonSizeRow title={title} rounded loading={loading} />
      <ButtonSizeRow title={title} icon="add" loading={loading} />
      <ButtonSizeRow title={title} icon="add" iconPlacement="right" loading={loading} />
      <ButtonSizeRow title={title} loading />
      <ButtonSizeRow title={title} disabled loading={loading} />

      {variants.map(variant => (
        <ButtonVariantRow
          key={variant}
          label={variant}
          variant={variant as keyof Omit<Theme['buttonVariants'], 'defaults'>}
          loading={loading}
          title={title} />
      ))}
    </ScrollContainer>
  )
}

const Button = (props: ButtonProps) => (
  <$Button m="xs" onPress={() => {}} {...props} />
)

const ButtonSizeRow = (buttonProps: ButtonProps) => (
  <Box flexDirection="row" alignItems="center" justifyContent="space-around">
    <Button size="s" {...buttonProps} />
    <Button {...buttonProps} />
    <Button size="l" {...buttonProps} />
  </Box>
)

const ButtonVariantRow = ({ label, ...buttonProps }: { label: string } & ButtonProps) => (
  <>
    <Label>{label}</Label>
    <Box flexDirection="row" alignItems="center" justifyContent="space-around" marginBottom="xs">
      <Button {...buttonProps} />
      <Button outline {...buttonProps} />
      <Button disabled {...buttonProps} />
    </Box>
  </>
)
