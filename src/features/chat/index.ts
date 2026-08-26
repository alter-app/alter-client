export {
  createChatRoom,
  fetchChatMessages,
  fetchChatRooms,
  markChatRoomRead,
} from './api/chatRoom'
export { fetchChatContacts } from './api/chatContacts'

export { useChatListViewModel } from './hooks/useChatListViewModel'
export { useChatRoomViewModel } from './hooks/useChatRoomViewModel'
export { useNewChatViewModel } from './hooks/useNewChatViewModel'
export { useChatRoomsQuery } from './hooks/query/useChatRoomsQuery'
export { useChatMessagesQuery } from './hooks/query/useChatMessagesQuery'
export { useChatContactsQuery } from './hooks/query/useChatContactsQuery'
export { useChatStomp } from './hooks/useChatStomp'

export { ChatBubble } from './ui/ChatBubble'
export { ChatConnectionBanner } from './ui/ChatConnectionBanner'
export { ChatDateDivider } from './ui/ChatDateDivider'
export { ChatRoomRow, SwipeableChatRoomItem } from './ui/ChatRoomListItem'
export { ChatSegmentTab } from './ui/ChatSegmentTab'
export { ContactPickerRow } from './ui/ContactPicker'
export { MessageInput } from './ui/MessageInput'
export { NewChatFab } from './ui/NewChatFab'
export { NewChatSheet } from './ui/NewChatSheet'
export { AttachmentTray } from './ui/AttachmentTray'

export {
  CHAT_ATTACHMENT_MAX_COUNT,
  CHAT_MESSAGE_MAX_LENGTH,
  CHAT_SEGMENTS,
  CHAT_SEGMENT_LABEL,
} from './types/chat'
export type {
  ChatConnectionState,
  ChatContact,
  ChatMessage,
  ChatMessageStatus,
  ChatRoomContext,
  ChatRoomDetail,
  ChatRoomListItem,
  ChatRoomSummary,
  ChatSegment,
  ChatTimelineEntry,
} from './types/chat'
export type {
  ChatMessageDto,
  ChatParticipantScope,
  ChatRoomDetailDto,
  ChatRoomListItemDto,
  ChatRoomTypeValue,
  CreateChatRoomRequest,
} from './types/dto'
