import noop from 'lodash/noop'
import React from 'react'
import { Switch } from 'react-native'
import { IMAGE_URI_1, IMAGE_URI_2 } from 'cosmos/ui'
import {
  ScrollContainer,
  ListItem,
  InputListItem,
  ListSection,
  Avatar,
  Text,
  TextInput,
  Picker
} from 'components/core'

export default () => {
  return (
    <ScrollContainer safe="top" keyboardShouldPersistTaps="handled">
      <ListSection>
        <ListItem title="Title" bottomDivider onPress={noop} />
        <ListItem title="Title" subtitle="Subtitle that is a decently long length with tons of detail about things" chevron bottomDivider onPress={noop} />
        <ListItem title="Title" rightIcon={{ name: 'info', color: 'infoRegular' }} bottomDivider onPress={noop}>
          <Text variant="p3" color="mainForegroundMuted">Children</Text>
        </ListItem>
        <ListItem leftIcon="perm-identity" title="Title" subtitle="Subtitle" rightIcon="check" bottomDivider onPress={noop} />
        <ListItem leftIcon={{ name: 'lightbulb', color: 'attentionHeavy' }} title="Title" bottomDivider rightContent={
          <Switch value />
        } />
        <InputListItem leftIcon={{ name: 'leaderboard', color: 'successRegular' }} title="TextInput" bottomDivider>
          <TextInput embedded placeholder="Enter text" hasError />
        </InputListItem>
        <InputListItem leftIcon="room" title="Picker">
          <Picker embedded placeholder="Select Item" items={[{ value: 1, label: "Item 1" }]} />
        </InputListItem>
      </ListSection>
      
      <ListSection title="Section Title">
        <ListItem
          leftContent={<Avatar rounded source={{ uri: IMAGE_URI_1 }} />}
          title="Title"
          subtitle="Subtitle"
          chevron
          bottomDivider
          onPress={noop} />
        <ListItem
          leftContent={<Avatar source={{ uri: IMAGE_URI_2 }} />}
          title="Title"
          chevron
          onPress={noop} />
      </ListSection>

      <ListSection topSpacing>
        <ListItem
          style={{ paddingLeft: 0 }}
          leftContent={<Avatar size="l" source={{ uri: IMAGE_URI_1 }} />}
          title="Title"
          subtitle="Subtitle"
          chevron
          bottomDivider
          onPress={noop} />
        <ListItem
          style={{ paddingLeft: 0 }}
          leftContent={<Avatar size="l" source={{ uri: IMAGE_URI_2 }} />}
          title="Title"
          subtitle="Subtitle"
          chevron
          onPress={noop} />
      </ListSection>
    </ScrollContainer>
  )
}
