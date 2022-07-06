"use strict";

/**
 * Объект, описывающий набор навыков человека.
 * Содержит внутреннее представление этих навыков в виде массива
 * объектов и методы для взаимодействия с ними:
 *
 * generateSkillsList - формирует HTML-представление объекта skills
 * (но не воздействует на DOM-дерево напрямую);
 *
 * sortSkillsList - меняет порядок элементов списка навыков,
 *
 * setSkillsList - инициализирует список навыков объекта.
 * (Подробнее о методах см. ниже)
 */
const skills = {
    list: [],   /* Список изначально пуст */

/**
 * Формирует HTML-представление списка навыков на основе внутреннего состояния
 * и возвращает его как фрагмент документа.
 *
 * @returns {DocumentFragment}  список навыков в виде элементов страницы dt/dd.
 */
generateSkillsList : function () {

    const descriptionList = new DocumentFragment();

    /* Так как список навыков может быть пуст, добавим соответствующую проверку */
    if(this.list.length) {
        this.list.forEach(skill => {
            const dt = document.createElement("dt");
            dt.classList.add(`skill-${skill.name.toLowerCase()}`);
            dt.textContent = skill.name;

            const dd = document.createElement("dd");
            dd.classList.add("level");

            const div = document.createElement("div");
            div.style.width = `${skill.level}%`;
            div.textContent = `${skill.level}%`;

            dd.append(div);
            descriptionList.append(dt);
            descriptionList.append(dd);
        });
    }
    return descriptionList;
},

/**
 * Направление сортировки по названию навыков:
 * 1 - прямое (алфавитный порядок),
 * 0 - обратное.
 */
sortByNameMode: 1,
/* Функция сравнения для сортировки навыков в алфавитном порядке */
compareByName: (a, b) => a.name.localeCompare(b.name),
/* Функция сравнения для сортировки навыков в порядке, обратном алфавитному */
compareByNameInvert: (a, b) => b.name.localeCompare(a.name),

/**
 * Направление сортировки по уровню владения навыками:
 * 1 - прямое (по возрастанию),
 * 0 - обратное (по убыванию).
 */
sortByLevelMode: 1,
/* Функция сравнения для сортировки в порядке возрастания уровня владения */
compareByLevel: (a, b) => a.level - b.level,
/* Функция сравнения для сортировки в порядке убывания уровня владения */
compareByLevelInvert: (a, b) => b.level - a.level,

/**
 * Сортирует внутреннее представление списка навыков (list) по выбранному
 * свойству. Направление сортировки меняется на противоположное после
 * каждого запуска метода.
 *
 * @param {String} property - выбранное свойство, по которому будет сортироваться
 * список. Разрешенные значения "name" и "level". Если передано недопустимое
 * значение, то сортируется "по уровню".
 */
sortSkillsList: function (property) {

    /* Так как список навыков может быть пуст, добавим соответствующую проверку */
    if (!this.list.length) {
        return;
    }

    let compareFunc;
    /**
     * На основе выбранного свойства и текущего направления сортировки выбирается
     * функция сравнения (прямая или инверсная) для метода sort. Направление затем
     * меняется на противоположное.
     */
    if (property == "name") {
        if (this.sortByNameMode) {
            compareFunc = this.compareByName;
            this.sortByNameMode = 0;
        } else {
            compareFunc = this.compareByNameInvert;
            this.sortByNameMode = 1;
        }
    } else {
        if (this.sortByLevelMode) {
            compareFunc = this.compareByLevel;
            this.sortByLevelMode = 0;
        } else {
            compareFunc = this.compareByLevelInvert;
            this.sortByLevelMode = 1;
        }
    }

    this.list.sort(compareFunc);
},

/**
 * Инициализирует список навыков объекта.
 * Передаваемый параметр должен быть массивом объектов,
 * каждый из которых содержит свойства "name" и "level".
 *
 * @param {Array} json - спосок навыков в виде массива объектов.
 */
setSkillsList: function (json) {
    this.list = [];
    if (Array.isArray(json)) {
        /**
         * Каждый элемент переданного массива валидируется (проверяются наличие
         * и правильность типов для "name" и "level"), и если проверка успешна,
         * то навык добавляется к внутреннему списку.
         */
        json.forEach(entry => {
            if (typeof entry.name == "string" &&
                typeof entry.level == "number") {
                    const skill = {};
                    skill.name = entry.name;
                    skill.level = entry.level;
                    this.list.push(skill);
                }
        });
    }
}
};


const skillsList = document.querySelector(".skills-list"),
      buttonsBlock = document.querySelector(".buttons-block");

fetch("db/skills.json")
    .then(data => data.json())
    .then(json => {
        /* Инициализируем объект skills данными из файла */
        skills.setSkillsList(json);
        /* Стартовая генерация списка навыков */
        skillsList.replaceChildren(skills.generateSkillsList());
    })
    .catch(() => console.error("Oops, something went wrong!"));

/**
 * При обработке нажатия кнопок используется делегирование событий:
 * сам обработчик "вешается" на весь блок кнопок (.buttons-block),
 * а конкретная кнопка, вызвавшая событие, определяется по dataset-
 * атрибуту.
 */
buttonsBlock.addEventListener("click", (event) => {
    const btn = event.target;
    /* Сортировка списка навыков по выбранному свойству */
    skills.sortSkillsList(btn.dataset.attr);
    /* Генерация HTML-представления списка и его вставка в DOM-дерево */
    skillsList.replaceChildren(skills.generateSkillsList());
});
