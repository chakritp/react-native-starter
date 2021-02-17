import React from 'react'
import { View } from 'react-native'
import { useValue } from 'react-cosmos/fixture'
import { Label } from 'cosmos/ui'
import { ScrollContainer, ButtonProps, Button as $Button } from 'components/core'
import { ButtonVariant, useTheme } from 'theme'

export default () => {
  const theme = useTheme()
  const variants = Object.keys(theme.buttonVariants) as ButtonVariant[] 
  const [title] = useValue('title', { defaultValue: "Bump" })

  return (
    <ScrollContainer
      safe="top"
      padding
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'space-around' }}
    >
      <ButtonSizeRow title={title} />
      <ButtonSizeRow title={title} outline rounded={false} />
      <ButtonSizeRow title={title} outline />
      <ButtonSizeRow title={title} icon="add" />
      <ButtonSizeRow title={title} icon="add" iconPlacement="right" />
      <ButtonSizeRow title={title} loading />
      <ButtonSizeRow title={title} disabled />

      {variants.map(variant => (
        <ButtonVariantRow
          key={variant}
          label={variant}
          variant={variant}
          title={title} />
      ))}
    </ScrollContainer>
  )
}

const Button = (props: ButtonProps) => (
  <$Button style={{ margin: 4 }} onPress={() => {}} {...props} />
)

const ButtonSizeRow = (buttonProps: ButtonProps) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
    <Button size="s" {...buttonProps} />
    <Button {...buttonProps} />
    <Button size="l" {...buttonProps} />
  </View>
)

const ButtonVariantRow = ({ label, ...buttonProps }: { label: string } & ButtonProps) => (
  <View>
    <Label>{label}</Label>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: 5 }}>
      <Button {...buttonProps} />
      <Button outline {...buttonProps} />
      <Button disabled {...buttonProps} />
    </View>
  </View>
)
