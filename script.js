"use strict";

const skills = [
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
];


const skillsList = document.querySelector(".skills-list");

/**
 * Чтобы не хранить css-класс внутри массива, мы будем получать его
 * из названия навыка с помощью интерполяции. Для этого каждый css-класс,
 * связанный с навыком, должен иметь вид: .skill-<имя_навыка_строчными>.
 */
skills.forEach(skill => {
    const dt = document.createElement("dt");
    dt.classList.add(`skill-${skill.name.toLowerCase()}`);
    dt.textContent = skill.name;

    const dd = document.createElement("dd");
    dd.classList.add("level");

    const div = document.createElement("div");
    div.style.width = `${skill.level}%`;
    div.textContent = `${skill.level}%`;

    dd.append(div);
    skillsList.append(dt);
    skillsList.append(dd);
});
