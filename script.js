let searchResultArray = [];
const searchContent = document.querySelector(".container__search");
const searchInput = document.querySelector("input");
let searchForm = document.forms.search;
let resultInputSearch = searchForm.elements.search;

// добавляем событие на инпут
const getRequest = () => {
	searchInput.addEventListener("change", function(event) {
		getSearch()
	});
};

// проверяем, заполенен ли контент поиска
const removeList = () => {
	const togglItem = document.querySelector(".search-list");
	if (togglItem !== null) {
		togglItem.remove();
	}
};

const getSearch = () => {
	// очищаем контент, если инпут пустой
	if (resultInputSearch.value === "") {
		removeList();
	}
	// передаем запрос из инпута в git
	searchResultToGit(resultInputSearch.value);
}

const addResult = (e) => {
	//добавляем выбранный результат
	let resultContent = searchResultArray.find((item) => item.id == e.target.id);

	const name = document.createElement("div");
	name.classList.add("result-item__name");
	name.textContent = `Name: ${resultContent.name}`;

	const author = document.createElement("div");
	author.classList.add("result-item__author");
	author.textContent = `Owner: ${resultContent.author}`;

	const star = document.createElement("div");
	star.classList.add("result-item__stars");
	star.textContent = `Stars: ${resultContent.star}`;

	const content = document.createElement("div");
	content.classList.add("result-content__item", "result-item");

	content.append(name);
	content.append(author);
	content.append(star);

	const buttonElementdelete = document.createElement("button");
	buttonElementdelete.classList.add("result-content__btn-close");
	buttonElementdelete.addEventListener("click", (e) => {
		let btn = e.target;
		btn.parentElement.remove();
	});

	const searchResultContent = document.createElement("div");
	searchResultContent.classList.add("search-result__content", "result-content");
	searchResultContent.append(content);
	searchResultContent.append(buttonElementdelete);

	const searchResult = document.querySelector(".search-result");
	searchResult.append(searchResultContent);
};

const searchResultToGit = (search) => {
	try {
		fetch(`https://api.github.com/search/repositories?q=${search}&sort=stars&order=desc`)
		.then(result => result.json())
		.then((result) => {
			let lengthArr = result.items.length > 5 ? 5 : result.items.length;
			const fragment = document.createDocumentFragment();
			const searchList = document.createElement("div");
			searchList.classList.add("search__list", "search-list");
			
			for (let i = 0; i < lengthArr; i++) {
				searchResultArray.push({
					id: result.items[i].id,
					name: result.items[i].name,
					author: result.items[i].owner.login,
					star: result.items[i].stargazers_count,
				});
				
				const listItem = document.createElement("div");
				listItem.classList.add("search-list__item");
				listItem.setAttribute("id", `${result.items[i].id}`);
				listItem.textContent = result.items[i].name;
				searchList.append(listItem);
				listItem.addEventListener("click", (e) => {
					addResult(e);
				});
				
				fragment.append(searchList);
			}
			
			removeList();
			searchContent.append(fragment);
		})
		.catch((e) => console.log("Error: ", e));
	} catch (e) {
		console.log("Error: ", e);
	}
};

getRequest();