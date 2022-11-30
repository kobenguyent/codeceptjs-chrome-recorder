codeceptjs-chrome-recorder

# codeceptjs-chrome-recorder

## Table of contents

### Functions

- [codeceptjsStringifyChromeRecording](README.md#codeceptjsstringifychromerecording)
- [parseRecordingContent](README.md#parserecordingcontent)
- [stringifyParsedStep](README.md#stringifyparsedstep)
- [transformParsedRecording](README.md#transformparsedrecording)

## Functions

### codeceptjsStringifyChromeRecording

▸ **codeceptjsStringifyChromeRecording**(`recording`): `Promise`<`Promise`<`string`\> \| `undefined`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `recording` | `string` |

#### Returns

`Promise`<`Promise`<`string`\> \| `undefined`\>

#### Defined in

main.ts:24

___

### parseRecordingContent

▸ **parseRecordingContent**(`recordingContent`): `Schema.UserFlow`

#### Parameters

| Name | Type |
| :------ | :------ |
| `recordingContent` | `string` |

#### Returns

`Schema.UserFlow`

#### Defined in

main.ts:4

___

### stringifyParsedStep

▸ **stringifyParsedStep**(`step`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `step` | `Step` |

#### Returns

`Promise`<`string`\>

#### Defined in

main.ts:18

___

### transformParsedRecording

▸ **transformParsedRecording**(`parsedRecording`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `parsedRecording` | `UserFlow` |

#### Returns

`Promise`<`string`\>

#### Defined in

main.ts:10
