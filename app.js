const { createApp } = Vue;

createApp({
    data() {
        return {
            questions: [],
            currentIndex: 0,
            showAnswer: false,
            showSolution: false,
            sidebarCollapsed: false,
            selectedChapterSection: '',
            currentSection: '',
            expandedChapters: [],
            expandedTags: {} // 存储每层的展开状态
        };
    },
    computed: {
        chapterTree() {
            const tree = {};
            const order = ['高等数学', '线性代数', '概率统计'];

            this.questions.forEach(q => {
                if (!tree[q.chapter]) tree[q.chapter] = {};
                if (!tree[q.chapter][q.section]) tree[q.chapter][q.section] = {};

                // 按tags构建层级
                if (q.tags && q.tags.length > 0) {
                    let current = tree[q.chapter][q.section];
                    q.tags.forEach((tag, idx) => {
                        if (!current[tag]) current[tag] = {};
                        current = current[tag];
                    });
                }
            });

            // 按指定顺序排序
            const sectionOrder = {
                '高等数学': ['极限', '一元微分', '一元积分', '微分方程', '多元微分', '二重积分', '反常积分'],
                '线性代数': ['行列式', '矩阵', '向量', '线性方程组', '特征值与特征向量', '二次型', '数学一专项'],
                '概率统计': ['事件与概率', '一维随机变量', '二维随机变量', '数字特征', '大数定律中心极限定理', '统计初步']
            };

            const sortedTree = {};
            order.forEach(chapter => {
                if (tree[chapter]) {
                    // 对section排序
                    const sections = tree[chapter];
                    const sortedSections = {};
                    const orderList = sectionOrder[chapter] || [];

                    orderList.forEach(sec => {
                        if (sections[sec]) sortedSections[sec] = sections[sec];
                    });
                    // 其他section放后面
                    Object.keys(sections).forEach(sec => {
                        if (!orderList.includes(sec)) sortedSections[sec] = sections[sec];
                    });

                    sortedTree[chapter] = sortedSections;
                }
            });
            // 其他章节放后面
            Object.keys(tree).forEach(chapter => {
                if (!order.includes(chapter)) sortedTree[chapter] = tree[chapter];
            });

            return sortedTree;
        },
        chapterOptions() {
            const options = [];
            Object.keys(this.chapterTree).forEach(chapter => {
                Object.keys(this.chapterTree[chapter]).forEach(section => {
                    options.push({
                        value: `${chapter}-${section}`,
                        label: `${chapter} - ${section}`
                    });
                });
            });
            return options;
        },
        filteredQuestions() {
            return this.questions;
        },
        currentQuestion() {
            return this.filteredQuestions[this.currentIndex];
        }
    },
    methods: {
        async loadQuestions() {
            try {
                const response = await fetch('data/questions.json');
                this.questions = await response.json();
                // 默认展开前三个章节
                const order = ['高等数学', '线性代数', '概率统计'];
                this.expandedChapters = order.slice(0, 3);
            } catch (error) {
                console.error('加载失败:', error);
            }
        },
        toggleChapter(chapter) {
            const index = this.expandedChapters.indexOf(chapter);
            if (index > -1) {
                this.expandedChapters.splice(index, 1);
            } else {
                this.expandedChapters.push(chapter);
            }
        },
        toggleTag(pathArray) {
            const key = pathArray.join('/');
            this.expandedTags[key] = !this.expandedTags[key];
        },
        isTagExpanded(pathArray) {
            const key = pathArray.join('/');
            return this.expandedTags[key];
        },
        selectByTags(chapter, section, tags) {
            // 按chapter + section + tags前缀匹配筛选
            if (!tags || tags.length === 0) {
                this.selectSection(chapter, section);
                return;
            }

            const index = this.findQuestionIndex(chapter, section, tags);
            if (index > -1) {
                this.currentIndex = index;
                this.currentSection = `${chapter}-${section}`;
                this.resetAnswerState();
            } else {
                // 如果没找到精确匹配，按chapter+section筛选
                this.selectSection(chapter, section);
            }
        },
        selectSection(chapter, section) {
            this.currentSection = `${chapter}-${section}`;
            const index = this.questions.findIndex(q =>
                q.chapter === chapter && q.section === section
            );
            if (index > -1) {
                this.currentIndex = index;
                this.resetAnswerState();
            }
        },
        // 筛选特定section+tags组合的题目
        findQuestionIndex(chapter, section, tags) {
            return this.questions.findIndex(q =>
                q.chapter === chapter &&
                q.section === section &&
                q.tags &&
                tags &&
                q.tags.length >= tags.length &&
                tags.every((t, i) => q.tags[i] === t)
            );
        },
        onSectionChange() {
            const [chapter, section] = this.selectedChapterSection.split('-');
            this.selectSection(chapter, section);
        },
        prevQuestion() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.resetAnswerState();
            }
        },
        nextQuestion() {
            if (this.currentIndex < this.filteredQuestions.length - 1) {
                this.currentIndex++;
                this.resetAnswerState();
            }
        },
        resetAnswerState() {
            this.showAnswer = false;
            this.showSolution = false;
            this.$nextTick(() => this.renderMath());
        },
        renderMath() {
            renderMathInElement(document.querySelector('.question-container'), {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ]
            });
        }
    },
    mounted() {
        this.loadQuestions().then(() => {
            this.$nextTick(() => this.renderMath());
        });
    },
    updated() {
        this.$nextTick(() => this.renderMath());
    }
}).mount('#app');
