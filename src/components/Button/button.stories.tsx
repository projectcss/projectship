import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Button, { ButtonSize, ButtonType } from './button'

const styles: React.CSSProperties = {
    textAlign: 'center'
}

const CenterDecorator = (storyFn: any) => <div style={styles}>{storyFn()}</div>

const defaultButton = () => (
    <Button onClick={action("clicked")}>default button</Button>
)
const buttonWithSize = () => (
    <>
        <Button size={ButtonSize.Large} onClick={action("clicked")}>large button</Button>
        <Button size={ButtonSize.Small} onClick={action("clicked")}>small button</Button>
    </>
)

const buttonWithType = () => (
    <>
        <Button btnType={ButtonType.Primary}> primary button </Button>
        <Button btnType={ButtonType.Danger}> danger button </Button>
        <Button btnType={ButtonType.Link} href="https://google.com"> link button </Button>
    </>
)

storiesOf('Button Component', module)
  .addDecorator(CenterDecorator)
  .add('Button', defaultButton)
  .add('不同尺寸的 Button', buttonWithSize)
  .add('不同类型的 Button', buttonWithType)