import { defineStore } from 'pinia';
import axios from 'axios';

export const useChatStore = defineStore('chat', {
    state: () => ({
        messages: [],
        isLoading: false,
        error: null
    }),

    getters: {
        getMessages: (state) => state.messages
    },

    actions: {
        async fetchMessages() {
            this.isLoading = true;
            try {
                const response = await axios.get('/api/messages');
                this.messages = response.data;
                this.error = null;
            } catch (error) {
                this.error = error.response && error.response.data && error.response.data.message || '获取消息失败';
            } finally {
                this.isLoading = false;
            }
        },

        async sendMessage(message) {
            try {
                console.log('store收到消息:', message);

                // 处理字符串类型的消息（向后兼容）
                let data = {};
                if (typeof message === 'string') {
                    data = {
                        type: 'text',
                        content: message
                    };
                }
                // 处理对象类型的消息，包含类型和内容
                else if (typeof message === 'object' && message !== null) {
                    data = message;

                    // 确保消息至少有type和content字段
                    if (!data.type) {
                        data.type = 'text';
                    }

                    if (!data.content) {
                        throw new Error('消息内容不能为空');
                    }
                } else {
                    throw new Error('无效的消息格式');
                }

                console.log('准备发送到服务器的数据:', data);
                try {
                    const response = await axios.post('/api/messages', data);
                    console.log('服务器响应:', response.data);
                    this.messages.push(response.data);
                    return { success: true };
                } catch (axiosError) {
                    console.error('API请求错误:', axiosError);
                    const errorMsg =
                        axiosError.response &&
                        axiosError.response.data &&
                        axiosError.response.data.message ||
                        '发送消息失败';

                    return {
                        success: false,
                        message: errorMsg
                    };
                }
            } catch (error) {
                console.error('发送消息处理错误:', error);
                return {
                    success: false,
                    message: error.message || '发送消息失败'
                };
            }
        },

        addMessage(message) {
            this.messages.push(message);
        }
    }
});