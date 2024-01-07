// Verifica se o documento HTML está carregado; se não, aguarda o evento 'DOMContentLoaded'
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    // Se o documento já estiver carregado, chama a função 'ready()' imediatamente
    ready();
}

// Função chamada quando o DOM está pronto
function ready() {
    // Seleciona todos os botões de remoção de produto
    const removeProductButtoms = document.getElementsByClassName("remove-product-buttom");
    console.log(removeProductButtoms);

    // Adiciona um ouvinte de evento 'click' a cada botão de remoção
    for (var i = 0; i < removeProductButtoms.length; i++) {
        removeProductButtoms[i].addEventListener("click", removeProduct);
    }

    // Seleciona todos os inputs de quantidade de produto
    const quantityInputs = document.getElementsByClassName("product-qtd-input");

    // Adiciona um ouvinte de evento 'change' a cada input de quantidade
    for (var i = 0; i < quantityInputs.length; i++) {
        quantityInputs[i].addEventListener("change", checkIfInputIsNull);
    }

    // Seleciona todos os botões "Adicionar ao Carrinho"
    const addToCartButtons = document.getElementsByClassName("button-houver-background");

    // Adiciona um ouvinte de evento 'click' a cada botão "Adicionar ao Carrinho"
    for (var i = 0; i < addToCartButtons.length; i++) {
        addToCartButtons[i].addEventListener("click", addProductToCart);
    }
}

// Função chamada quando o valor de um input de quantidade é alterado
function checkIfInputIsNull(event) {
    // Remove a linha do produto se a quantidade for zero
    if (event.target.value === "0") {
        event.target.parentElement.parentElement.remove();
    }

    // Atualiza o total do carrinho
    updateTotal();
}

// Adiciona um produto ao carrinho
function addProductToCart(event) {
    const button = event.target;
    const productInfos = button.parentElement.parentElement;
    const productImage = productInfos.getElementsByClassName("bebida-image")[0].src;
    const productTitle = productInfos.getElementsByClassName("bebida-title")[0].innerText;
    const productPrice = productInfos.getElementsByClassName("product-price")[0].innerText;

    // Verifica se o produto já está no carrinho; se sim, incrementa a quantidade
    const productsCartName = document.getElementsByClassName("cart-product-title");
    for (var i = 0; i < productsCartName.length; i++) {
        if (productsCartName[i].innerText === productTitle) {
            productsCartName[i].parentElement.parentElement.getElementsByClassName("product-qtd-input")[0].value++;
            return;
        }
    }

    // Cria uma nova linha de produto no carrinho
    let newCartProduct = document.createElement("tr");
    newCartProduct.classList.add("cart-product");

    newCartProduct.innerHTML =
        `
        <td class="product-identification">
            <img class="cart-product-image" src="${productImage}" alt="${productTitle}">
            <strong class="cart-product-title">${productTitle}</strong>
        </td>
        <td>
            <span class="cart-product-price">${productPrice}</span>
        </td>
        <td>
            <input class="product-qtd-input" type="number" value="1" min="0">
            <button class="remove-product-buttom" type="button">Remover</button>
        </td>
    `;

    // Adiciona a nova linha ao corpo da tabela do carrinho
    const tableBody = document.querySelector(".cart-table tbody");
    tableBody.append(newCartProduct);

    // Adiciona ouvintes de eventos para o novo input e botão de remoção
    updateTotal();
    newCartProduct.getElementsByClassName("product-qtd-input")[0].addEventListener("change", checkIfInputIsNull);
    newCartProduct.getElementsByClassName("remove-product-buttom")[0].addEventListener("click", removeProduct);
}

// Remove um produto do carrinho
function removeProduct(event) {
    event.target.parentElement.parentElement.remove();
    // Atualiza o total do carrinho
    updateTotal();
}

// Atualiza o preço total do carrinho
function updateTotal() {
    let totalAmount = 0;
    const cartProducts = document.getElementsByClassName("cart-product");

    // Calcula o preço total somando o preço de cada produto multiplicado pela sua quantidade
    for (var i = 0; i < cartProducts.length; i++) {
        const productPrice = cartProducts[i].getElementsByClassName("cart-product-price")[0].innerText.replace("R$", "").replace(",", ".");
        const productQuantity = cartProducts[i].getElementsByClassName("product-qtd-input")[0].value;

        totalAmount +=  productPrice * productQuantity;
    }

    // Formata o valor total como uma string em formato monetário brasileiro
    totalAmount = totalAmount.toFixed(2);
    totalAmount = totalAmount.replace(".", ",");
    
    // Atualiza o elemento HTML que exibe o total do carrinho
    document.querySelector(".cart-total-container span").innerText = "R$" + totalAmount;
}
