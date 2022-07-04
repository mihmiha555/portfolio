"use strict";

/**
 * Объект, описывающий набор навыков человека.
 * Содержит внутреннее представление этих навыков в виде массива
 * объектов и методы для взаимодействия с ними:
 *
 * generateSkillsList - формирует HTML-представление объекта skills
 * (но не воздействует на DOM-дерево напрямую);
 *
 * sortSkillsList - меняет порядок элементов списка навыков.
 * (Подробнее о методах см. ниже)
 */
const skills = {
    list: [
    {
        name: "C",
        level: 92
    },
    {
        name: "C++",
        level: 72
    },
    {
        name: "Python",
        level: 33
    },
    {
        name: "Linux",
        level: 80
    },
    {
        name: "HTML",
        level: 60
    },
    {
        name: "CSS",
        level: 40
    }
    ],

/**
 * Формирует HTML-представление списка навыков на основе внутреннего состояния
 * и возвращает его как фрагмент документа.
 *
 * @returns {DocumentFragment}  список навыков в виде элементов страницы dt/dd.
 */
generateSkillsList : function () {

    const descriptionList = new DocumentFragment();

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
}
};


const skillsList = document.querySelector(".skills-list"),
      buttonsBlock = document.querySelector(".buttons-block");

/* Стартовая генерация списка навыков */
skillsList.replaceChildren(skills.generateSkillsList());

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
