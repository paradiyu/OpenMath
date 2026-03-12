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
            expandedChapters: []
        };
    },
    computed: {
        chapterTree() {
            const tree = {};
            this.questions.forEach(q => {
                if (!tree[q.chapter]) tree[q.chapter] = [];
                if (!tree[q.chapter].includes(q.section)) {
                    tree[q.chapter].push(q.section);
                }
            });
            return tree;
        },
        chapterOptions() {
            const options = [];
            Object.keys(this.chapterTree).forEach(chapter => {
                this.chapterTree[chapter].forEach(section => {
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
                if (this.questions.length > 0) {
                    this.expandedChapters = [this.questions[0].chapter];
                }
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
