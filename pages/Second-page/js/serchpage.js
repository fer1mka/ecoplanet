document.getElementById('search-button').addEventListener('click', function() {  
	const searchInput = document.getElementById('search-input').value.trim();  
	const message = document.getElementById('message');  

	// Удаляем предыдущие выделения  
	removeHighlights();  
	if (searchInput === '') {  
			message.textContent = 'Пожалуйста, введите текст для поиска.';  
			return;  
	}  

	const regex = new RegExp(`(${searchInput})`, 'gi');  
	const content = document.getElementById('text-selection-div');  

	// Проверяем наличие совпадений  
	if (!highlightText(content, regex)) {  
			message.textContent = 'Совпадений не найдено.';  
	} else {  
			message.textContent = '';  
	}  
});  

function highlightText(container, regex) {  
	let hasMatches = false;  

	// Проходим по всем элементам внутри контейнера
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, null, false);  

	while (walker.nextNode()) {  
			const currentNode = walker.currentNode;  

			// Обрабатываем только текстовые узлы
			if (currentNode.nodeType === Node.TEXT_NODE) {
					const text = currentNode.nodeValue;  

					if (regex.test(text)) {  
							hasMatches = true; 

							// Создаем фрагмент документа для замены 
							const fragment = document.createDocumentFragment(); 
							let lastIndex = 0; 
							let match; 

							// Находим все совпадения и создаем элементы 
							while ((match = regex.exec(text)) !== null) { 
									// Добавляем текст до совпадения 
									if (match.index > lastIndex) { 
											fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index))); 
									} 
									// Добавляем элемент span с выделением для совпадения 
									const span = document.createElement('span'); 
									span.className = 'highlight'; 
									span.textContent = match[0]; 
									fragment.appendChild(span); 
									lastIndex = match.index + match[0].length; 
							} 

							// Добавляем оставшийся текст после последнего совпадения 
							if (lastIndex < text.length) { 
									fragment.appendChild(document.createTextNode(text.substring(lastIndex))); 
							} 

							// Заменяем текущий узел на созданный фрагмент 
							currentNode.parentNode.replaceChild(fragment, currentNode); 
					}  
			}
	}  

	return hasMatches;  
}  

function removeHighlights() {  
	const highlightedElements = document.querySelectorAll('.highlight');  

	highlightedElements.forEach(element => {  
			const parentNode = element.parentNode;  

			// Заменяем элемент span обратно на текстовый узел 
			parentNode.replaceChild(document.createTextNode(element.textContent), element);  

			// Удаляем пустые узлы если они есть 
			if (!parentNode.innerHTML.trim()) {  
					parentNode.remove();  
			}  
	});  
}
