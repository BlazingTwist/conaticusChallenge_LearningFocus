((Main) => {

    let activeModal = null;
    let targetCategory = null;
    let targetQuestion = null;

    Main.onclickOpenCategory = function onclickOpenCategory(iconButton) {
        iconButton.parentNode.parentNode.removeAttribute("closed");
    }

    Main.onclickCloseCategory = function onclickCloseCategory(iconButton) {
        iconButton.parentNode.parentNode.setAttribute("closed", true);
    }

    Main.onToggleCategory = function onToggleCategory(categoryText) {
        if (categoryText.parentNode.parentNode.hasAttribute("closed")) {
            categoryText.parentNode.parentNode.removeAttribute("closed");
        } else {
            categoryText.parentNode.parentNode.setAttribute("closed", true);
        }
    }

    Main.editQuestion = function editQuestion(element) {
        let typeSelect = document.getElementById("create-type-select");
        typeSelect.value = "Question";
        let target = NodeUtils.findChildWithTag(element.parentNode, "span");
        document.getElementById("question-input").value = target.getAttribute("question");
        document.getElementById("question-answer-input").value = target.getAttribute("answer");
        document.getElementById("question-title-input").value = target.getAttribute("title");
        Main.openEditorModal(null, target);
    }

    Main.addButtonPressed = function addButtonPressed(iconElement) {
        document.getElementById("question-input").value = "";
        document.getElementById("question-answer-input").value = "";
        document.getElementById("question-title-input").value = "";
        Main.openEditorModal(iconElement, null);
    }

    Main.openEditorModal = function openEditorModal(category, question) {
        if (activeModal) {
            console.warn("tried to open two modals simultaneously!");
            return;
        }

        if (category) {
            targetCategory = category.parentNode.parentNode;
            targetQuestion = null;
        }else{
            targetCategory = null;
        }

        if (question) {
            targetCategory = null;
            targetQuestion = question;
        }else{
            targetQuestion = null;
        }

        let modalElement = document.getElementById("editor-modal");
        modalElement.setAttribute("opened", true);
        activeModal = modalElement;

        let modalBackdropElement = document.getElementById("modal-backdrop");
        modalBackdropElement.setAttribute("enabled", true);
    }

    function createGroupNode(groupName) {
        let questionCategoryDiv = document.createElement("div");
        questionCategoryDiv.classList.add("question-category");

        let categoryTitleDiv = document.createElement("div");
        categoryTitleDiv.classList.add("basic-flex-row");
        categoryTitleDiv.classList.add("category-header");
        questionCategoryDiv.appendChild(categoryTitleDiv);

        let openIcon = document.createElement("i");
        openIcon.classList.add("fa-regular");
        openIcon.classList.add("fa-folder-open");
        openIcon.classList.add("fa-xs");
        openIcon.classList.add("icon-button");
        openIcon.classList.add("category-icon-open");
        openIcon.onclick = () => {
            Main.onclickCloseCategory(openIcon);
        };
        categoryTitleDiv.appendChild(openIcon);

        let closeIcon = document.createElement("i");
        closeIcon.classList.add("fa-solid");
        closeIcon.classList.add("fa-folder");
        closeIcon.classList.add("fa-xs");
        closeIcon.classList.add("icon-button");
        closeIcon.classList.add("category-icon-closed");
        closeIcon.onclick = () => {
            Main.onclickOpenCategory(closeIcon);
        };
        categoryTitleDiv.appendChild(closeIcon);

        let categoryTitle = document.createElement("span");
        categoryTitle.classList.add("category-name");
        categoryTitle.onclick = () => {
            Main.onToggleCategory(categoryTitle);
        }
        categoryTitle.innerText = groupName;
        categoryTitleDiv.appendChild(categoryTitle);

        let addIcon = document.createElement("i");
        addIcon.classList.add("fa-square-plus");
        addIcon.classList.add("fa-solid");
        addIcon.classList.add("fa-xs");
        addIcon.classList.add("icon-button");
        addIcon.style.marginLeft = "20px";
        addIcon.onclick = () => {
            Main.addButtonPressed(addIcon);
        }
        categoryTitleDiv.appendChild(addIcon);

        return questionCategoryDiv;
    }

    function createQuestion(questionText, questionAnswer, titleOptional) {
        let questionDiv = document.createElement("div");
        questionDiv.classList.add("basic-flex-row");
        questionDiv.classList.add("question");

        let questionIcon = document.createElement("i");
        questionIcon.classList.add("fa-solid");
        questionIcon.classList.add("fa-gear");
        questionIcon.classList.add("fa-xs");
        questionIcon.classList.add("icon-button");
        questionIcon.onclick = () => {
            Main.editQuestion(questionIcon);
        }
        questionDiv.appendChild(questionIcon);

        let questionTitle = document.createElement("span");
        questionTitle.innerText = titleOptional;
        questionTitle.setAttribute("question", questionText);
        questionTitle.setAttribute("answer", questionAnswer);
        questionTitle.setAttribute("title", titleOptional);
        questionTitle.onclick = () => {
            Main.editQuestion(questionTitle);
        }
        questionDiv.appendChild(questionTitle);

        return questionDiv;
    }

    Main.saveModalData = function saveModalData() {
        if (activeModal === document.getElementById("editor-modal")) {
            let type = document.getElementById("create-type-select").value;
            if (type === "Group") {
                let groupName = document.getElementById("group-name-input").value;
                if (groupName.trim() === "") {
                    return;
                }
                AnimatedList.appendNode(targetCategory || document.getElementById("question-list"), createGroupNode(groupName))
            } else {
                /**
                 * @type {string}
                 */
                let questionText = document.getElementById("question-input").value;
                if (questionText.trim() === "") {
                    return;
                }
                let questionAnswer = document.getElementById("question-answer-input").value;
                let titleOptional = document.getElementById("question-title-input").value;
                if (titleOptional.trim() === "") {
                    titleOptional = questionText.substr(0, Math.min(20, questionText.length));
                }
                if (targetQuestion) {
                    targetQuestion.setAttribute("question", questionText);
                    targetQuestion.setAttribute("answer", questionAnswer);
                    targetQuestion.setAttribute("title", titleOptional);
                    targetQuestion.innerText = titleOptional;
                } else {
                    AnimatedList.appendNode(targetCategory
                        || document.getElementById("question-list"), createQuestion(questionText, questionAnswer, titleOptional));
                }
            }
        }
    }

    Main.closeModal = function closeModal(saveData) {
        if (activeModal) {
            if (saveData) {
                Main.saveModalData();
            }

            activeModal.removeAttribute("opened");
            activeModal = null;

            let modalBackdropElement = document.getElementById("modal-backdrop");
            modalBackdropElement.removeAttribute("enabled");
        }
    }

    /**
     * @param {HTMLSelectElement} selectElement
     */
    Main.editorSelectType = function editorSelectType(selectElement) {
        let groupModal = document.getElementById("editor-modal--group");
        let questionModal = document.getElementById("editor-modal--question");
        if (selectElement.value === "Group") {
            groupModal.setAttribute("selected", true);
            questionModal.removeAttribute("selected");
        } else {
            groupModal.removeAttribute("selected");
            questionModal.setAttribute("selected", true);
        }
    }

})(window.Main = window.Main || {});