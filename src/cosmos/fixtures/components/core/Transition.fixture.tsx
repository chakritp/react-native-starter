import React, { useEffect, useState } from 'react'
import { useValue } from 'react-cosmos/fixture'
import { Container, Transition, Text, Box } from 'components/core'

export default () => {
  const [mounted, setMounted] = useState(true)
  const [transitionIn, setTransitionIn] = useState(true)
  const [animateOnMount] = useValue('animateOnMount', { defaultValue: true })
  const [snapshotChildren] = useValue('snapshotChildren', { defaultValue: false })

  useEffect(() => {
    setTimeout(() => {
      setTransitionIn(!transitionIn)
      if (!transitionIn) {
        setMounted(true)
      } else {
        setTimeout(() => {
          setMounted(false)
        }, 500)
      }
    }, 1000)
  }, [transitionIn])

  return (
    <Container p="xl" center alignItems="center" safe>
      {mounted ? (
        <Transition
          property="opacity"
          animateOnMount={animateOnMount}
          snapshotChildren={snapshotChildren}
          hideWhen="out"
          in={transitionIn}
        >
          {() => (
            <Box
              alignItems="center"
              justifyContent="center"
              width={150}
              height={150}
              bg="infoRegular"
            >
              <Text variant="h1" color="white">
                {transitionIn ? 'In' : 'Out'}
              </Text>
            </Box>
          )}
        </Transition>
      ) : null}
    </Container>
  )
}
