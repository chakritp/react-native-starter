import React from 'react'
import { Box, Button, Container, Toast } from 'components/core'

const TOAST_MESSAGE = "You want a toe? I can get you a toe, believe me. There are ways, Dude. You don't wanna know about it, believe me."

export default () => {
  return (
    <Container alignItems="center" justifyContent="center">
      <Box>
        <Button mb="l" title="info" onPress={() => Toast.info(TOAST_MESSAGE)} />
        <Button mb="l" title="success" onPress={() => Toast.success(TOAST_MESSAGE)} />
        <Button mb="l" title="warning" onPress={() => Toast.warning(TOAST_MESSAGE)} />
        <Button mb="l" title="danger" onPress={() => Toast.danger(TOAST_MESSAGE)} />
      </Box>
    </Container>
  )
}
