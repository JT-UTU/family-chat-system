<template>
  <div class="chat-container">
    <div class="chat-sidebar">
      <div class="logo">
        <h2>家庭聊天</h2>
      </div>
      <div class="user-info">
        <div class="avatar" @click="showProfileModal = true">
          <img :src="userAvatar" alt="用户头像">
          <div class="avatar-edit-hint">
            <i class="el-icon-edit"></i>
          </div>
        </div>
        <div class="username">{{ currentUser?.username }}</div>
      </div>
      <div class="menu">
        <div class="menu-item" :class="{ active: activeTab === 'chat' }" @click="switchTab('chat')">
          <i class="el-icon-chat-dot-round"></i>
          <span>聊天室</span>
        </div>
        <div class="menu-item" :class="{ active: activeTab === 'games' }" @click="switchTab('games')">
          <i class="el-icon-trophy"></i>
          <span>游戏中心</span>
        </div>
        <div class="menu-item" :class="{ active: activeTab === 'users' }" @click="switchTab('users')">
          <i class="el-icon-user"></i>
          <span>用户列表</span>
        </div>
        <div class="menu-item" :class="{ active: activeTab === 'settings' }" @click="switchTab('settings')">
          <i class="el-icon-setting"></i>
          <span>设置</span>
        </div>
      </div>
      <div class="logout-btn">
        <el-button type="danger" @click="handleLogout" plain>退出登录</el-button>
      </div>
    </div>
    
    <div class="chat-main">
      <!-- 聊天界面 -->
      <div v-if="activeTab === 'chat'">
        <div class="chat-header">
          <h3>家庭聊天室</h3>
          <div class="header-actions">
            <span class="online-count">在线人数: 1</span>
            <el-button type="primary" size="small" icon="el-icon-refresh-right" circle @click="fetchMessages"></el-button>
          </div>
        </div>
        
        <div class="chat-content" ref="chatContentRef">
          <div v-if="messages.length === 0" class="empty-message">
            <el-empty description="暂无消息，开始聊天吧！"></el-empty>
          </div>
          
          <div class="messages-timeline" v-else>
            <div v-for="(group, date) in groupedMessages" :key="date">
              <div class="date-divider">
                <span>{{ formatDate(date) }}</span>
              </div>
              
              <div v-for="(message, index) in group" :key="message.id || index" 
                  class="message-item" 
                  :class="{ 'my-message': message.userId === currentUser?.id }">
                <div class="message-avatar">
                  {{ message.username.charAt(0).toUpperCase() }}
                </div>
                <div class="message-body">
                  <div class="message-info">
                    <span class="username">{{ message.username }}</span>
                    <span class="time">{{ formatTime(message.createdAt) }}</span>
                  </div>
                  <!-- 标准文本消息 -->
                  <div class="message-content" v-if="message.type === 'text'">{{ message.content }}</div>
                  
                  <!-- 加入/离开消息 -->
                  <div class="system-message" v-else-if="message.type === 'system'">{{ message.content }}</div>
                  
                  <!-- 游戏相关消息 -->
                  <div class="game-message" v-else-if="message.type === 'game'">
                    <i class="el-icon-data-analysis"></i>
                    <span>{{ message.content }}</span>
                  </div>
                  
                  <!-- 绘画消息 -->
                  <div class="drawing-message" v-else-if="message.type === 'drawing'">
                    <div class="drawing-message-header">
                      <i class="el-icon-picture-outline"></i>
                      <span>{{ message.content }}</span>
                    </div>
                    <div class="drawing-image">
                      <img :src="message.drawingData" alt="用户绘画" />
                    </div>
                  </div>
                  
                  <!-- 投票消息 -->
                  <div class="vote-message" v-else-if="message.type === 'vote'">
                    <div class="vote-message-header">
                      <i class="el-icon-s-check"></i>
                      <span>{{ message.content }}</span>
                    </div>
                    <div class="vote-message-action">
                      <el-button size="small" type="primary" @click="handleJoinVote(message.voteData)">参与投票</el-button>
                    </div>
                  </div>
                  
                  <!-- 投票选择消息 -->
                  <div class="vote-cast-message" v-else-if="message.type === 'vote-cast'">
                    <i class="el-icon-check"></i>
                    <span>{{ message.content }}</span>
                  </div>
                  
                  <!-- 投票结果消息 -->
                  <div class="vote-result-message" v-else-if="message.type === 'vote-end'">
                    <div class="vote-result-header">
                      <i class="el-icon-trophy"></i>
                      <span>投票结束</span>
                    </div>
                    <div class="vote-result-content">
                      <pre>{{ message.content }}</pre>
                    </div>
                  </div>
                  
                  <!-- 文件消息 -->
                  <div class="file-message" v-else-if="message.type === 'file'">
                    <div class="file-message-header">
                      <i class="el-icon-document"></i>
                      <span>{{ message.content }}</span>
                    </div>
                    <div class="file-message-body">
                      <i class="el-icon-document file-icon"></i>
                      <div class="file-info">
                        <div class="file-name">{{ message.fileName }}</div>
                        <div class="file-size">{{ formatFileSize(message.fileSize) }}</div>
                      </div>
                      <a :href="message.fileUrl" target="_blank" class="file-download">
                        <el-button size="mini" type="primary" icon="el-icon-download">下载</el-button>
                      </a>
                    </div>
                  </div>
                  
                  <!-- 图片消息 -->
                  <div class="image-message" v-else-if="message.type === 'image'">
                    <div class="image-message-header">
                      <i class="el-icon-picture-outline"></i>
                      <span>{{ message.content }}</span>
                    </div>
                    <div class="image-container">
                      <el-image
                        :src="message.fileUrl"
                        :preview-src-list="[message.fileUrl]"
                        fit="cover"
                        class="chat-image"
                      >
                        <div slot="error" class="image-error">
                          <i class="el-icon-picture-outline"></i>
                        </div>
                      </el-image>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chat-input-container">
          <div class="input-container">
            <div class="emoji-container">
              <el-button class="emoji-btn" icon="el-icon-smile" circle @click="showEmojiPicker = !showEmojiPicker"></el-button>
              <div class="emoji-picker" v-if="showEmojiPicker">
                <div class="emoji-list">
                  <span v-for="emoji in emojis" :key="emoji" @click="insertEmoji(emoji)">{{ emoji }}</span>
                </div>
              </div>
            </div>
            
            <!-- 文件上传按钮 -->
            <div class="file-upload-container">
              <el-upload
                ref="upload"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleFileChange"
                :limit="1"
              >
                <el-button icon="el-icon-paperclip" circle></el-button>
              </el-upload>
              
              <!-- 图片预览 -->
              <el-image
                v-if="filePreview.show && filePreview.type === 'image'"
                :src="filePreview.url"
                class="file-preview"
                fit="contain"
              >
                <div slot="error" class="image-error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              
              <!-- 文件预览 -->
              <div v-if="filePreview.show && filePreview.type === 'file'" class="file-info-preview">
                <i class="el-icon-document"></i>
                <span>{{ filePreview.name }}</span>
                <el-button type="text" icon="el-icon-close" @click="cancelFileUpload"></el-button>
              </div>
            </div>
            
            <textarea 
              v-model="messageContent" 
              placeholder="输入消息..." 
              @keydown.ctrl.enter="sendMessage"
            ></textarea>
            
            <el-button 
              type="primary" 
              circle 
              icon="el-icon-s-promotion" 
              @click="sendMessage" 
              :loading="sending"
              :disabled="!messageContent.trim() && !filePreview.show"
            ></el-button>
          </div>
          <div class="input-tip">按 Ctrl + Enter 发送消息</div>
        </div>
      </div>
      
      <!-- 游戏中心 -->
      <div v-if="activeTab === 'games'" class="games-container">
        <div class="section-header">
          <h3>家庭游戏中心</h3>
          <p class="section-desc">和家人一起玩游戏，增进感情</p>
        </div>
        
        <div class="games-grid">
          <div class="game-card" @click="startGame('guess')">
            <div class="game-icon">🎮</div>
            <div class="game-title">猜词游戏</div>
            <div class="game-desc">猜猜我在想什么？考验你们之间的默契</div>
          </div>
          
          <div class="game-card" @click="startGame('rps')">
            <div class="game-icon">✂️</div>
            <div class="game-title">石头剪刀布</div>
            <div class="game-desc">经典游戏，线上对决</div>
          </div>
          
          <div class="game-card" @click="startGame('vote')">
            <div class="game-icon">📊</div>
            <div class="game-title">家庭投票</div>
            <div class="game-desc">今天吃什么？去哪里玩？一起决定</div>
          </div>
          
          <div class="game-card" @click="startGame('draw')">
            <div class="game-icon">🎨</div>
            <div class="game-title">你画我猜</div>
            <div class="game-desc">发挥你的艺术天赋，看谁猜得快</div>
          </div>
        </div>
        
        <!-- 游戏界面 -->
        <div v-if="currentGame" class="game-playground">
          <div class="game-header">
            <h4>{{ gameInfo.title }}</h4>
            <el-button size="small" @click="closeGame" type="text">返回游戏列表</el-button>
          </div>
          
          <!-- 猜词游戏 -->
          <div v-if="currentGame === 'guess'" class="guess-game">
            <div class="game-rules">
              <p>游戏规则：一人选择一个词，给出提示，其他人猜这个词是什么。</p>
            </div>
            <div v-if="gameRole === 'creator'" class="game-creator-panel">
              <h5>你是出题者</h5>
              <el-form>
                <el-form-item label="选择一个词">
                  <el-input v-model="guessGame.word" placeholder="输入一个词"></el-input>
                </el-form-item>
                <el-form-item label="给出提示">
                  <el-input v-model="guessGame.hint" placeholder="给其他人一些提示"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitGuessGame">开始游戏</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div v-else class="game-guesser-panel">
              <h5>你是猜词者</h5>
              <div class="hint-box">
                <h6>提示：</h6>
                <p>{{ guessGame.hint || '等待出题者给出提示...' }}</p>
              </div>
              <el-form v-if="guessGame.hint">
                <el-form-item label="你的猜测">
                  <el-input v-model="guessGame.guess" placeholder="猜一猜是什么词"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitGuess">提交猜测</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          
          <!-- 石头剪刀布游戏 -->
          <div v-if="currentGame === 'rps'" class="rps-game">
            <div class="game-rules">
              <p>游戏规则：选择石头、剪刀或布，看看谁是赢家！</p>
            </div>
            <div class="rps-choices">
              <div class="rps-choice" @click="makeRPSChoice('rock')" :class="{ selected: rpsGame.playerChoice === 'rock' }">
                <div class="choice-icon">👊</div>
                <div class="choice-name">石头</div>
              </div>
              <div class="rps-choice" @click="makeRPSChoice('scissors')" :class="{ selected: rpsGame.playerChoice === 'scissors' }">
                <div class="choice-icon">✌️</div>
                <div class="choice-name">剪刀</div>
              </div>
              <div class="rps-choice" @click="makeRPSChoice('paper')" :class="{ selected: rpsGame.playerChoice === 'paper' }">
                <div class="choice-icon">✋</div>
                <div class="choice-name">布</div>
              </div>
            </div>
            <div class="rps-result" v-if="rpsGame.result">
              <div class="computer-choice">
                电脑选择了：
                <span v-if="rpsGame.computerChoice === 'rock'">👊 石头</span>
                <span v-else-if="rpsGame.computerChoice === 'scissors'">✌️ 剪刀</span>
                <span v-else-if="rpsGame.computerChoice === 'paper'">✋ 布</span>
              </div>
              <div class="result-text" :class="rpsGame.result">
                <span v-if="rpsGame.result === 'win'">你赢了！🎉</span>
                <span v-else-if="rpsGame.result === 'lose'">你输了！😢</span>
                <span v-else>平局！🤝</span>
              </div>
            </div>
            <el-button type="primary" @click="resetRPSGame" v-if="rpsGame.result">再来一局</el-button>
          </div>
          
          <!-- 你画我猜游戏 -->
          <div v-if="currentGame === 'draw'" class="draw-game">
            <div class="game-rules">
              <p>游戏规则：在画布上作画，让家人猜你画的是什么。</p>
            </div>
            
            <div class="drawing-area">
              <div class="drawing-tools">
                <div class="tool-group">
                  <span class="tool-label">画笔颜色:</span>
                  <div class="color-picker">
                    <div class="color-item" 
                         v-for="color in drawingColors" 
                         :key="color" 
                         :style="{ backgroundColor: color }"
                         :class="{ active: drawingTool.color === color }"
                         @click="drawingTool.color = color"></div>
                  </div>
                </div>
                
                <div class="tool-group">
                  <span class="tool-label">画笔大小:</span>
                  <el-slider v-model="drawingTool.size" :min="1" :max="20" :step="1"></el-slider>
                </div>
                
                <el-button type="danger" size="small" @click="clearCanvas">清空画布</el-button>
              </div>
              
              <canvas ref="canvas" 
                      class="drawing-canvas" 
                      @mousedown="startDrawing" 
                      @mousemove="draw" 
                      @mouseup="stopDrawing"
                      @mouseleave="stopDrawing"
                      @touchstart="handleTouchStart"
                      @touchmove="handleTouchMove"
                      @touchend="stopDrawing"></canvas>
              
              <div class="drawing-hint">
                <el-input v-model="drawGame.word" placeholder="告诉大家你要画什么（可选）"></el-input>
                <el-button type="primary" @click="shareDrawing" :disabled="!canvasIsEmpty">分享作品</el-button>
              </div>
            </div>
          </div>
          
          <!-- 家庭投票 -->
          <div v-if="currentGame === 'vote'" class="vote-game">
            <div class="game-rules">
              <p>游戏规则：创建一个投票，让家人共同决定重要事项。</p>
            </div>
            
            <div v-if="voteGame.activeVote">
              <div class="vote-header">
                <h5>{{ voteGame.activeVote.question }}</h5>
                <p class="vote-creator">由 {{ voteGame.activeVote.creator }} 发起</p>
              </div>
              
              <div class="vote-options">
                <div v-for="(option, index) in voteGame.activeVote.options" :key="index" 
                     class="vote-option" 
                     :class="{ selected: voteGame.myVote === index }"
                     @click="castVote(index)">
                  <div class="option-content">
                    <div class="option-text">{{ option.text }}</div>
                    <div class="vote-progress">
                      <div class="progress-bar" 
                           :style="{ width: `${calculateVotePercentage(option.votes)}%` }"></div>
                      <div class="vote-count">{{ option.votes }} 票</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="vote-actions">
                <el-button type="primary" @click="endVote" v-if="isVoteCreator">结束投票</el-button>
                <el-button @click="exitVoteResults">返回</el-button>
              </div>
            </div>
            
            <div v-else class="create-vote">
              <el-form>
                <el-form-item label="投票问题">
                  <el-input v-model="voteGame.question" placeholder="例如：今晚吃什么？"></el-input>
                </el-form-item>
                
                <div v-for="(option, index) in voteGame.options" :key="index" class="option-item">
                  <el-form-item :label="`选项 ${index + 1}`">
                    <div class="option-input">
                      <el-input v-model="voteGame.options[index]" :placeholder="`选项 ${index + 1}`"></el-input>
                      <el-button 
                        type="danger" 
                        icon="el-icon-delete" 
                        circle 
                        @click="removeVoteOption(index)" 
                        v-if="voteGame.options.length > 2"></el-button>
                    </div>
                  </el-form-item>
                </div>
                
                <div class="form-actions">
                  <el-button type="primary" plain @click="addVoteOption">添加选项</el-button>
                  <el-button type="primary" @click="createVote" :disabled="!canCreateVote">创建投票</el-button>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 用户列表和设置可以根据需要稍后实现 -->
      <div v-if="activeTab === 'users'" class="users-container">
        <div class="section-header">
          <h3>用户列表</h3>
        </div>
        <p class="coming-soon">功能开发中，敬请期待...</p>
      </div>
      
      <div v-if="activeTab === 'settings'" class="settings-container">
        <div class="section-header">
          <h3>设置</h3>
        </div>
        <p class="coming-soon">功能开发中，敬请期待...</p>
      </div>
    </div>
    
    <!-- 个人资料弹窗 -->
    <el-dialog
      title="个人资料设置"
      :visible.sync="showProfileModal"
      width="500px"
      :close-on-click-modal="false"
    >
      <div class="profile-settings">
        <div class="avatar-settings">
          <div class="current-avatar" @click="triggerAvatarUpload">
            <img :src="previewAvatar || userAvatar" alt="用户头像">
            <div class="avatar-upload-hint">
              <i class="el-icon-upload"></i>
              <span>更改头像</span>
            </div>
          </div>
          
          <input 
            ref="avatarInput" 
            type="file" 
            style="display: none" 
            accept="image/*" 
            @change="handleAvatarChange"
          />
        </div>
        
        <div class="profile-form">
          <el-form label-width="80px" :model="profileForm">
            <el-form-item label="用户名">
              <el-input v-model="profileForm.username" :disabled="true"></el-input>
            </el-form-item>
            
            <el-form-item label="昵称">
              <el-input v-model="profileForm.nickname" placeholder="设置您的昵称"></el-input>
            </el-form-item>
            
            <el-form-item label="主题">
              <el-radio-group v-model="profileForm.theme">
                <el-radio label="light">浅色</el-radio>
                <el-radio label="dark">深色</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="showProfileModal = false">取消</el-button>
        <el-button type="primary" @click="saveProfile" :loading="savingProfile">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../store/user';
import { useChatStore } from '../store/chat';
import axios from 'axios';

export default {
  name: 'Chat',
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const chatStore = useChatStore();
    
    const chatContentRef = ref(null);
    const messageContent = ref('');
    const sending = ref(false);
    const showEmojiPicker = ref(false);
    const activeTab = ref('chat');
    const currentGame = ref('list');
    const gameRole = ref('guesser'); // 默认为猜词者
    
    // 游戏相关状态
    const guessGame = reactive({
      word: '',
      hint: '',
      guess: ''
    });
    
    const rpsGame = reactive({
      playerChoice: '',
      computerChoice: '',
      result: '' // win, lose, draw
    });
    
    const drawGame = reactive({
      word: ''
    });
    
    const voteGame = reactive({
      question: '',
      options: ['', ''],
      myVote: -1,
      activeVote: null
    });
    
    const drawingTool = reactive({
      color: '#000',
      size: 10
    });
    
    const drawingColors = ['#000', '#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399'];
    
    const canvasIsEmpty = computed(() => {
      const canvas = document.querySelector('.drawing-canvas');
      if (!canvas) return true;
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
          return false;
        }
      }
      return true;
    });
    
    const canCreateVote = computed(() => {
      return voteGame.question.trim() !== '' && voteGame.options.every(option => option.trim() !== '');
    });
    
    const isVoteCreator = computed(() => {
      if (!voteGame.activeVote) return false;
      return voteGame.activeVote.creator === currentUser.value?.username;
    });
    
    const gameInfo = computed(() => {
      const games = {
        guess: { title: '猜词游戏' },
        rps: { title: '石头剪刀布' },
        vote: { title: '家庭投票' },
        draw: { title: '你画我猜' }
      };
      return games[currentGame.value] || {};
    });
    
    const currentUser = computed(() => userStore.getUser);
    const messages = computed(() => chatStore.getMessages);
    
    // 表情包列表
    const emojis = ['😊', '😂', '❤️', '👍', '😍', '🎉', '🔥', '😎', '🤔', '😢', '😴', '🙏', '👋', '🌹', '🎂', '☕', '🌞', '🌙', '🍕', '🏠'];
    
    // 按日期分组消息
    const groupedMessages = computed(() => {
      const groups = {};
      
      messages.value.forEach(message => {
        const date = new Date(message.createdAt).toLocaleDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
      });
      
      return groups;
    });
    
    // 切换标签页
    const switchTab = (tab) => {
      activeTab.value = tab;
      if (currentGame.value && tab !== 'games') {
        currentGame.value = null;
      }
    };
    
    // 开始游戏
    const startGame = (game) => {
      currentGame.value = game;
      
      // 随机分配角色（猜词游戏）
      if (game === 'guess') {
        gameRole.value = Math.random() > 0.5 ? 'creator' : 'guesser';
      }
      
      // 重置游戏状态
      if (game === 'rps') {
        resetRPSGame();
      }
    };
    
    // 关闭游戏
    const closeGame = () => {
      currentGame.value = null;
    };
    
    // 猜词游戏相关方法
    const submitGuessGame = () => {
      if (!guessGame.word || !guessGame.hint) {
        ElMessage.warning('请输入词语和提示');
        return;
      }
      
      ElMessage.success('已出题，等待他人猜测');
      // 在真实环境中，这里应该通过WebSocket将词语和提示发送给其他用户
    };
    
    const submitGuess = () => {
      if (!guessGame.guess) {
        ElMessage.warning('请输入你的猜测');
        return;
      }
      
      // 模拟检查猜测结果
      setTimeout(() => {
        // 在真实环境中，这里应该通过WebSocket检查猜测是否正确
        const isCorrect = Math.random() > 0.5; // 随机模拟结果
        
        if (isCorrect) {
          ElMessage.success('恭喜你，猜对了！');
        } else {
          ElMessage.error('猜错了，继续加油！');
        }
        
        guessGame.guess = '';
      }, 500);
    };
    
    // 石头剪刀布游戏相关方法
    const makeRPSChoice = (choice) => {
      rpsGame.playerChoice = choice;
      
      // 电脑随机选择
      const choices = ['rock', 'scissors', 'paper'];
      rpsGame.computerChoice = choices[Math.floor(Math.random() * choices.length)];
      
      // 判断结果
      if (rpsGame.playerChoice === rpsGame.computerChoice) {
        rpsGame.result = 'draw';
      } else if (
        (rpsGame.playerChoice === 'rock' && rpsGame.computerChoice === 'scissors') ||
        (rpsGame.playerChoice === 'scissors' && rpsGame.computerChoice === 'paper') ||
        (rpsGame.playerChoice === 'paper' && rpsGame.computerChoice === 'rock')
      ) {
        rpsGame.result = 'win';
      } else {
        rpsGame.result = 'lose';
      }
    };
    
    const resetRPSGame = () => {
      rpsGame.playerChoice = '';
      rpsGame.computerChoice = '';
      rpsGame.result = '';
    };
    
    // 格式化日期
    const formatDate = (dateStr) => {
      const today = new Date().toLocaleDateString();
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
      
      if (dateStr === today) {
        return '今天';
      } else if (dateStr === yesterday) {
        return '昨天';
      } else {
        return dateStr;
      }
    };
    
    // 格式化时间
    const formatTime = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };
    
    // 插入表情
    const insertEmoji = (emoji) => {
      // 确保messageContent是一个字符串
      if (typeof messageContent.value !== 'string') {
        messageContent.value = '';
      }
      messageContent.value += emoji;
      showEmojiPicker.value = false;
    };
    
    // 滚动到底部
    const scrollToBottom = async () => {
      await nextTick();
      if (chatContentRef.value) {
        chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
      }
    };
    
    // 监听消息变化，自动滚动到底部
    watch(() => messages.value.length, scrollToBottom);
    
    // 发送消息
    const sendMessage = async () => {
      // 如果没有消息内容且没有文件，则不发送
      if (!messageContent.value.trim() && !filePreview.show) return;
      
      sending.value = true;
      try {
        // 处理文件上传
        if (filePreview.show) {
          await sendFileMessage();
        } 
        // 发送普通文本消息
        else if (typeof messageContent.value === 'string') {
          const msgData = {
            type: 'text',
            content: messageContent.value
          };
          console.log('准备发送文本消息:', msgData);
          
          const result = await chatStore.sendMessage(msgData);
          console.log('发送文本消息结果:', result);
          
          if (result.success) {
            messageContent.value = '';
          } else {
            ElMessage.error(result.message || '消息发送失败');
          }
        } 
        // 发送特殊类型的消息（游戏、投票等）
        else {
          const msgData = messageContent.value;
          console.log('准备发送特殊消息:', msgData);
          
          const result = await chatStore.sendMessage(msgData);
          console.log('发送特殊消息结果:', result);
          
          if (result.success) {
            messageContent.value = '';
          } else {
            ElMessage.error(result.message || '消息发送失败');
          }
        }
      } catch (error) {
        console.error('发送消息时发生错误:', error);
        ElMessage.error('发送消息失败: ' + (error.message || '未知错误'));
      } finally {
        sending.value = false;
        showEmojiPicker.value = false;
      }
    };
    
    // 发送文件消息
    const sendFileMessage = async () => {
      if (!filePreview.file) return;
      
      try {
        // 创建FormData对象
        const formData = new FormData();
        formData.append('file', filePreview.file);
        
        // 创建文件名字段
        let caption = messageContent.value.trim() || filePreview.name;
        formData.append('caption', caption);
        
        // 发送文件数据
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (response.data && response.data.fileUrl) {
          // 文件上传成功，发送文件消息
          const fileMessage = {
            type: filePreview.type === 'image' ? 'image' : 'file',
            content: caption,
            fileUrl: response.data.fileUrl,
            fileName: filePreview.name,
            fileSize: filePreview.file.size
          };
          
          const result = await chatStore.sendMessage(fileMessage);
          
          if (result.success) {
            // 清空消息和文件预览
            messageContent.value = '';
            cancelFileUpload();
            ElMessage.success('文件发送成功');
          } else {
            ElMessage.error(result.message || '文件消息发送失败');
          }
        }
      } catch (error) {
        console.error('文件上传错误:', error);
        ElMessage.error('文件上传失败: ' + (error.response?.data?.message || error.message || '未知错误'));
      }
    };
    
    // 获取消息
    const fetchMessages = async () => {
      try {
        await chatStore.fetchMessages();
        ElMessage.success('已更新最新消息');
      } catch (error) {
        ElMessage.error('获取消息失败');
      }
    };
    
    // 退出登录
    const handleLogout = () => {
      userStore.logout();
      router.push('/');
    };
    
    // 你画我猜游戏相关方法
    const startDrawing = (event) => {
      const canvas = event.target;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      canvas.isDrawing = true;
    };
    
    const draw = (event) => {
      const canvas = event.target;
      if (!canvas.isDrawing) return;
      
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      ctx.lineTo(x, y);
      ctx.strokeStyle = drawingTool.color;
      ctx.lineWidth = drawingTool.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    };
    
    const stopDrawing = () => {
      const canvas = document.querySelector('.drawing-canvas');
      if (canvas) {
        canvas.isDrawing = false;
      }
    };
    
    const handleTouchStart = (event) => {
      event.preventDefault();
      const canvas = event.target;
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = event.touches[0].clientX - rect.left;
      const y = event.touches[0].clientY - rect.top;
      
      ctx.beginPath();
      ctx.moveTo(x, y);
      canvas.isDrawing = true;
    };
    
    const handleTouchMove = (event) => {
      event.preventDefault();
      const canvas = event.target;
      if (!canvas.isDrawing) return;
      
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = event.touches[0].clientX - rect.left;
      const y = event.touches[0].clientY - rect.top;
      
      ctx.lineTo(x, y);
      ctx.strokeStyle = drawingTool.color;
      ctx.lineWidth = drawingTool.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    };
    
    const clearCanvas = () => {
      const canvas = document.querySelector('.drawing-canvas');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };
    
    const shareDrawing = () => {
      const canvas = document.querySelector('.drawing-canvas');
      if (!canvas) return;
      
      const drawingDataUrl = canvas.toDataURL('image/png');
      const wordText = drawGame.word.trim() ? `我画的是：${drawGame.word}` : '分享了一幅画';
      
      // 发送绘画消息
      sendMessage({
        type: 'drawing',
        content: wordText,
        drawingData: drawingDataUrl
      });
      
      // 清空画布和输入
      clearCanvas();
      drawGame.word = '';
    };
    
    // 初始化画布
    const initCanvas = () => {
      const canvas = document.querySelector('.drawing-canvas');
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        clearCanvas();
      }
    };
    
    // 监听游戏变化，初始化画布
    watch(() => currentGame.value, (newGame) => {
      if (newGame === 'draw') {
        nextTick(() => {
          initCanvas();
        });
      }
    });
    
    // 投票游戏相关方法
    const addVoteOption = () => {
      voteGame.options.push('');
    };
    
    const removeVoteOption = (index) => {
      if (voteGame.options.length > 2) {
        voteGame.options.splice(index, 1);
      }
    };
    
    const createVote = () => {
      voteGame.activeVote = {
        id: Date.now().toString(),
        question: voteGame.question,
        options: voteGame.options.filter(opt => opt.trim() !== '').map(opt => ({
          text: opt,
          votes: 0,
          voters: []
        })),
        creator: currentUser.value?.username,
        createdAt: new Date(),
        totalVotes: 0
      };
      
      // 发送投票信息到聊天
      sendMessage({
        type: 'vote',
        content: `创建了一个投票: "${voteGame.question}"`,
        voteData: voteGame.activeVote
      });
      
      // 重置表单
      voteGame.question = '';
      voteGame.options = ['', ''];
      voteGame.myVote = -1;
    };
    
    const castVote = (optionIndex) => {
      if (!voteGame.activeVote) return;
      
      // 如果已经投票，移除之前的投票
      if (voteGame.myVote !== -1) {
        const prevOption = voteGame.activeVote.options[voteGame.myVote];
        prevOption.votes--;
        const voterIndex = prevOption.voters.indexOf(currentUser.value?.username);
        if (voterIndex !== -1) {
          prevOption.voters.splice(voterIndex, 1);
        }
        voteGame.activeVote.totalVotes--;
      }
      
      // 添加新的投票
      const option = voteGame.activeVote.options[optionIndex];
      option.votes++;
      option.voters.push(currentUser.value?.username);
      voteGame.activeVote.totalVotes++;
      voteGame.myVote = optionIndex;
      
      // 发送投票消息
      sendMessage({
        type: 'vote-cast',
        content: `投票选择了: "${option.text}"`,
        voteId: voteGame.activeVote.id,
        optionIndex: optionIndex
      });
    };
    
    const endVote = () => {
      if (!voteGame.activeVote) return;
      
      // 找出获胜选项
      let maxVotes = -1;
      let winningOptions = [];
      
      voteGame.activeVote.options.forEach((option, index) => {
        if (option.votes > maxVotes) {
          maxVotes = option.votes;
          winningOptions = [index];
        } else if (option.votes === maxVotes) {
          winningOptions.push(index);
        }
      });
      
      let resultMessage = `投票结果: "${voteGame.activeVote.question}"\n`;
      
      if (voteGame.activeVote.totalVotes === 0) {
        resultMessage += "没有人投票";
      } else if (winningOptions.length === 1) {
        resultMessage += `获胜选项: "${voteGame.activeVote.options[winningOptions[0]].text}" (${voteGame.activeVote.options[winningOptions[0]].votes}票)`;
      } else {
        resultMessage += `平局! 选项: ${winningOptions.map(idx => `"${voteGame.activeVote.options[idx].text}"`).join(', ')} 各获得 ${maxVotes} 票`;
      }
      
      // 发送投票结果消息
      sendMessage({
        type: 'vote-end',
        content: resultMessage,
        voteId: voteGame.activeVote.id,
        results: {
          winningOptions,
          totalVotes: voteGame.activeVote.totalVotes
        }
      });
      
      // 重置投票状态
      voteGame.activeVote = null;
      voteGame.myVote = -1;
    };
    
    const cancelVote = () => {
      // 重置投票表单
      voteGame.question = '';
      voteGame.options = ['', ''];
    };
    
    const exitVoteResults = () => {
      // 返回游戏列表
      currentGame.value = 'list';
      // 重置投票状态
      voteGame.activeVote = null;
      voteGame.myVote = -1;
    };
    
    // 处理投票相关消息
    const handleJoinVote = (voteData) => {
      if (!voteData) return;
      
      // 设置当前游戏为投票
      currentGame.value = 'vote';
      
      // 设置当前活动投票
      voteGame.activeVote = voteData;
      
      // 检查用户是否已经投票
      voteGame.myVote = -1;
      voteData.options.forEach((option, index) => {
        if (option.voters.includes(currentUser.value?.username)) {
          voteGame.myVote = index;
        }
      });
    };
    
    const handleVoteReceived = (message) => {
      // 如果是当前活动投票的更新，更新投票数据
      if (voteGame.activeVote && message.voteId === voteGame.activeVote.id) {
        const option = voteGame.activeVote.options[message.optionIndex];
        option.votes++;
        option.voters.push(message.sender);
        voteGame.activeVote.totalVotes++;
      }
    };
    
    const handleVoteEnded = (message) => {
      // 如果是当前活动投票的结束，重置投票状态
      if (voteGame.activeVote && message.voteId === voteGame.activeVote.id) {
        voteGame.activeVote = null;
        voteGame.myVote = -1;
      }
    };
    
    const calculateVotePercentage = (votes) => {
      if (!voteGame.activeVote || voteGame.activeVote.totalVotes === 0) {
        return 0;
      }
      return Math.round((votes / voteGame.activeVote.totalVotes) * 100);
    };
    
    // 文件上传相关状态
    const filePreview = reactive({
      show: false,
      type: '', // 'image' or 'file'
      url: '',
      file: null,
      name: ''
    });
    
    // 处理文件选择
    const handleFileChange = (file) => {
      const isImage = file.raw.type.startsWith('image/');
      
      filePreview.file = file.raw;
      filePreview.name = file.name;
      filePreview.type = isImage ? 'image' : 'file';
      filePreview.show = true;
      
      if (isImage) {
        filePreview.url = URL.createObjectURL(file.raw);
      }
    };
    
    // 取消文件上传
    const cancelFileUpload = () => {
      filePreview.show = false;
      filePreview.file = null;
      filePreview.url = '';
      filePreview.name = '';
      filePreview.type = '';
      
      // 重置el-upload组件
      if (upload.value) {
        upload.value.clearFiles();
      }
    };
    
    // 上传文件的引用
    const upload = ref(null);
    
    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (!bytes || bytes === 0) return '0 B';
      
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]);
    };
    
    // 个人资料弹窗相关状态
    const showProfileModal = ref(false);
    const profileForm = reactive({
      username: '',
      nickname: '',
      theme: localStorage.getItem('theme') || 'light'
    });
    const savingProfile = ref(false);
    const previewAvatar = ref('');
    const avatarFile = ref(null);
    
    const userAvatar = computed(() => {
      // 如果用户有自定义头像则使用，否则生成默认头像
      if (currentUser.value?.avatar) {
        return currentUser.value.avatar;
      }
      // 返回默认头像（用户名首字母）
      return `https://ui-avatars.com/api/?name=${currentUser.value?.username || 'U'}&background=random`;
    });
    
    // 主题设置
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
    };
    
    // 初始化主题
    const initTheme = () => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      applyTheme(savedTheme);
      profileForm.theme = savedTheme;
    };
    
    // 触发头像上传
    const triggerAvatarUpload = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          avatarFile.value = file;
          const reader = new FileReader();
          reader.onload = (e) => {
            previewAvatar.value = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    };
    
    // 保存个人资料
    const saveProfile = async () => {
      if (!profileForm.username.trim()) {
        ElMessage.warning('用户名不能为空');
        return;
      }
      
      savingProfile.value = true;
      try {
        // 如果有新头像，先上传头像
        let avatarUrl = currentUser.value?.avatar;
        
        if (avatarFile.value) {
          const formData = new FormData();
          formData.append('file', avatarFile.value);
          
          const response = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          if (response.data && response.data.fileUrl) {
            avatarUrl = response.data.fileUrl;
          }
        }
        
        // 保存用户资料
        const userData = {
          username: profileForm.username,
          nickname: profileForm.nickname,
          avatar: avatarUrl
        };
        
        // 这里应该调用API更新用户资料
        // const response = await axios.put('/api/user/profile', userData);
        
        // 更新主题
        applyTheme(profileForm.theme);
        
        // 关闭对话框
        showProfileModal.value = false;
        ElMessage.success('个人资料保存成功');
      } catch (error) {
        console.error('保存资料错误:', error);
        ElMessage.error('保存个人资料失败: ' + (error.response?.data?.message || error.message));
      } finally {
        savingProfile.value = false;
      }
    };
    
    // 处理头像上传
    const handleAvatarChange = () => {
      // 处理头像更改逻辑
    };
    
    onMounted(async () => {
      await chatStore.fetchMessages();
      // 初始化主题
      initTheme();
    });
    
    return {
      chatContentRef,
      messageContent,
      sending,
      currentUser,
      messages,
      showEmojiPicker,
      emojis,
      groupedMessages,
      activeTab,
      currentGame,
      gameInfo,
      gameRole,
      guessGame,
      rpsGame,
      drawGame,
      drawingTool,
      drawingColors,
      canvasIsEmpty,
      formatDate,
      formatTime,
      insertEmoji,
      sendMessage,
      fetchMessages,
      handleLogout,
      switchTab,
      startGame,
      closeGame,
      submitGuessGame,
      submitGuess,
      makeRPSChoice,
      resetRPSGame,
      startDrawing,
      draw,
      stopDrawing,
      handleTouchStart,
      handleTouchMove,
      clearCanvas,
      shareDrawing,
      canCreateVote,
      isVoteCreator,
      voteGame,
      addVoteOption,
      removeVoteOption,
      createVote,
      castVote,
      endVote,
      cancelVote,
      exitVoteResults,
      handleJoinVote,
      handleVoteReceived,
      handleVoteEnded,
      calculateVotePercentage,
      filePreview,
      handleFileChange,
      cancelFileUpload,
      upload,
      formatFileSize,
      showProfileModal,
      profileForm,
      savingProfile,
      previewAvatar,
      avatarFile,
      triggerAvatarUpload,
      handleAvatarChange,
      saveProfile,
      initTheme,
      applyTheme,
      userAvatar
    };
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

.chat-sidebar {
  width: 240px;
  background-color: #324057;
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 3px 0 5px rgba(0, 0, 0, 0.1);
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h2 {
  margin: 0;
  color: white;
  font-size: 22px;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  margin-right: 10px;
}

.user-name {
  font-size: 16px;
  font-weight: 500;
}

.menu {
  flex: 1;
  padding: 20px 0;
}

.menu-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  cursor: pointer;
}

.menu-item i {
  margin-right: 10px;
  font-size: 18px;
}

.menu-item.active {
  background-color: #409eff;
}

.menu-item:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-btn {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chat-header h3 {
  margin: 0;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
}

.online-count {
  margin-right: 15px;
  font-size: 14px;
  color: #67c23a;
}

.chat-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.empty-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.date-divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.date-divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background-color: #ebeef5;
  z-index: 0;
}

.date-divider span {
  background-color: #f9f9f9;
  padding: 0 10px;
  font-size: 12px;
  color: #909399;
  position: relative;
  z-index: 1;
}

.messages-timeline {
  padding-bottom: 20px;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  max-width: 85%;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #409eff;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
}

.my-message {
  margin-left: auto;
  flex-direction: row-reverse;
}

.my-message .message-avatar {
  margin-right: 0;
  margin-left: 10px;
  background-color: #67c23a;
}

.message-body {
  flex: 1;
  max-width: calc(100% - 50px);
}

.message-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
}

.username {
  font-weight: bold;
  color: #409eff;
}

.my-message .username {
  color: #67c23a;
}

.time {
  color: #909399;
}

.message-content {
  padding: 12px 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  word-break: break-word;
  line-height: 1.5;
}

.my-message .message-content {
  background-color: #ecf5ff;
}

.chat-input-container {
  padding: 15px 20px;
  background-color: white;
  border-top: 1px solid #ebeef5;
}

.input-container {
  display: flex;
  align-items: flex-end;
}

.emoji-container {
  position: relative;
}

.emoji-btn {
  cursor: pointer;
  font-size: 20px;
  color: #606266;
  transition: all 0.3s;
}

.emoji-btn:hover {
  color: #409eff;
}

.emoji-picker {
  position: absolute;
  bottom: 40px;
  left: 0;
  width: 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 10;
}

.emoji-list {
  display: flex;
  flex-wrap: wrap;
}

.emoji {
  font-size: 20px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.emoji:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
  transform: scale(1.2);
}

.file-upload-container {
  position: relative;
}

.file-upload-container .el-upload {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.file-preview {
  margin-left: 10px;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  object-fit: cover;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.file-info-preview {
  display: flex;
  align-items: center;
  padding: 5px;
  background-color: white;
  border-radius: 8px;
  margin-left: 10px;
}

.file-info-preview i {
  margin-right: 5px;
}

.file-info-preview span {
  font-size: 14px;
  color: #606266;
}

.file-info-preview button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.input-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  text-align: right;
}

/* 游戏中心样式 */
.games-container, .users-container, .settings-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f9f9f9;
  overflow-y: auto;
}

.section-header {
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-header h3 {
  margin: 0;
  color: #303133;
}

.section-desc {
  margin: 10px 0 0;
  color: #909399;
  font-size: 14px;
}

.coming-soon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #909399;
  font-size: 16px;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 20px;
}

.game-card {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.game-icon {
  font-size: 40px;
  margin-bottom: 15px;
}

.game-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
}

.game-desc {
  font-size: 14px;
  color: #606266;
  text-align: center;
}

.game-playground {
  background-color: white;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.game-header h4 {
  margin: 0;
  color: #303133;
  font-size: 18px;
}

.game-rules {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.game-rules p {
  margin: 0;
  color: #606266;
}

/* 猜词游戏样式 */
.game-creator-panel, .game-guesser-panel {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.hint-box {
  background-color: #ecf5ff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.hint-box h6 {
  margin: 0 0 10px;
  color: #409eff;
}

.hint-box p {
  margin: 0;
  color: #303133;
  font-weight: 500;
}

/* 石头剪刀布游戏样式 */
.rps-choices {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 30px 0;
}

.rps-choice {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  padding: 15px;
  border-radius: 8px;
}

.rps-choice:hover {
  background-color: #f5f7fa;
}

.rps-choice.selected {
  background-color: #ecf5ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.choice-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.choice-name {
  font-size: 16px;
  color: #303133;
}

.rps-result {
  text-align: center;
  margin: 30px 0;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.computer-choice {
  margin-bottom: 15px;
  font-size: 16px;
  color: #606266;
}

.result-text {
  font-size: 24px;
  font-weight: bold;
}

.result-text.win {
  color: #67c23a;
}

.result-text.lose {
  color: #f56c6c;
}

.result-text.draw {
  color: #e6a23c;
}

/* 你画我猜游戏样式 */
.draw-game {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.game-rules {
  margin-bottom: 20px;
}

.game-rules p {
  margin: 0;
  color: #606266;
}

.drawing-area {
  margin-bottom: 20px;
}

.drawing-tools {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.tool-group {
  margin-right: 20px;
}

.tool-label {
  font-weight: bold;
  margin-bottom: 5px;
}

.color-picker {
  display: flex;
  gap: 5px;
}

.color-item {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.color-item.active {
  border: 2px solid #409eff;
}

.drawing-canvas {
  width: 100%;
  height: 300px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 10px;
}

.drawing-hint {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawing-hint input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.drawing-hint button {
  padding: 10px 20px;
  border: none;
  background-color: #409eff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.drawing-hint button:disabled {
  background-color: #ebeef5;
  cursor: not-allowed;
}

/* 家庭投票样式 */
.vote-game {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 20px;
}

.game-rules {
  margin-bottom: 20px;
}

.game-rules p {
  margin: 0;
  color: #606266;
}

.vote-header {
  margin-bottom: 10px;
}

.vote-creator {
  font-size: 14px;
  color: #909399;
}

.vote-options {
  margin-bottom: 20px;
}

.vote-option {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.vote-option:hover {
  background-color: #f5f7fa;
}

.vote-option.selected {
  background-color: #ecf5ff;
}

.option-content {
  display: flex;
  align-items: center;
}

.option-text {
  flex: 1;
  margin-right: 10px;
}

.vote-progress {
  width: 100px;
  height: 10px;
  background-color: #ebeef5;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background-color: #409eff;
}

.vote-count {
  font-size: 14px;
  color: #909399;
}

.vote-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-vote {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.option-item {
  margin-bottom: 10px;
}

.option-input {
  display: flex;
  align-items: center;
}

.option-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-actions button {
  padding: 10px 20px;
  border: none;
  background-color: #409eff;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

.form-actions button:disabled {
  background-color: #ebeef5;
  cursor: not-allowed;
}

.drawing-image {
  margin-top: 10px;
  
  img {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }
}

/* 投票消息样式 */
.vote-message {
  background-color: #f0f9ff;
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid #409eff;
  
  .vote-message-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    i {
      margin-right: 8px;
      color: #409eff;
    }
    
    span {
      font-weight: 500;
    }
  }
  
  .vote-message-action {
    margin-top: 10px;
    text-align: right;
  }
}

.vote-cast-message {
  display: flex;
  align-items: center;
  color: #606266;
  font-style: italic;
  
  i {
    color: #67c23a;
    margin-right: 8px;
  }
}

.vote-result-message {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid #67c23a;
  
  .vote-result-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    i {
      margin-right: 8px;
      color: #67c23a;
    }
    
    span {
      font-weight: 500;
    }
  }
  
  .vote-result-content {
    pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      font-family: inherit;
    }
  }
}

/* 文件消息样式 */
.file-message {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid #909399;
  
  .file-message-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    i {
      margin-right: 8px;
      color: #909399;
    }
    
    span {
      font-weight: 500;
    }
  }
  
  .file-message-body {
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: 8px;
    padding: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    
    .file-icon {
      font-size: 24px;
      color: #909399;
      margin-right: 12px;
    }
    
    .file-info {
      flex: 1;
      
      .file-name {
        font-weight: 500;
        margin-bottom: 4px;
        word-break: break-all;
      }
      
      .file-size {
        font-size: 12px;
        color: #909399;
      }
    }
    
    .file-download {
      margin-left: 12px;
      text-decoration: none;
    }
  }
}

/* 图片消息样式 */
.image-message {
  background-color: #f0f9ff;
  border-radius: 8px;
  padding: 12px;
  border-left: 4px solid #409eff;
  
  .image-message-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    
    i {
      margin-right: 8px;
      color: #409eff;
    }
    
    span {
      font-weight: 500;
    }
  }
  
  .image-container {
    margin-top: 10px;
    
    .chat-image {
      max-width: 300px;
      max-height: 300px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
    }
  }
}

/* 个人资料设置样式 */
.profile-settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .avatar-settings {
    margin-bottom: 20px;
    
    .current-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      border: 3px solid #409eff;
      background-color: #f0f9ff;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .avatar-upload-hint {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s;
        color: white;
        
        i {
          font-size: 24px;
          margin-bottom: 8px;
        }
        
        span {
          font-size: 14px;
        }
      }
      
      &:hover .avatar-upload-hint {
        opacity: 1;
      }
    }
  }
  
  .profile-form {
    width: 100%;
  }
}

/* 用户头像样式 */
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 10px;
  position: relative;
  cursor: pointer;
  background-color: #409eff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color: white;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-edit-hint {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
    color: white;
  }
  
  &:hover .avatar-edit-hint {
    opacity: 1;
  }
}
</style> 