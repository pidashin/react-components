import React from 'react'
import Comp from '../loopSlider'

export default {
  title: 'components/loopSlider',
  component: Comp
}

const Template = args => (
  <div style={{ width: '100vw' }}>
    <Comp {...args} />
  </div>
)

export const demo = Template.bind({})
