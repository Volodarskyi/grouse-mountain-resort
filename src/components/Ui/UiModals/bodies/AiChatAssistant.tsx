import { Input } from "antd";

import type { AiChatAssistantModalProps } from "@/store/reducers/modalStore";

export default function AiChatAssistant({
    context,
    initialMessage,
}: AiChatAssistantModalProps) {
    return (
        <div className="app-modal-body">
            {context && <p className="app-modal-body__text">{context}</p>}

            <Input.TextArea
                className="app-modal-body__input"
                defaultValue={initialMessage}
                placeholder="Ask the assistant..."
            />
        </div>
    );
}
