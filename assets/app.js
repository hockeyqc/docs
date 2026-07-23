(() => {
  "use strict";

  const catalogue = Array.isArray(window.HOCKEY_QUEBEC_DOCUMENTS)
    ? window.HOCKEY_QUEBEC_DOCUMENTS
    : [];

  const grid = document.querySelector("#documents");
  const count = document.querySelector("#catalogue-count");
  const searchContainer = document.querySelector("#search-container");
  const searchInput = document.querySelector("#document-search");

  if (!grid || !count) {
    return;
  }

  const normalize = (value) =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("fr-CA")
      .trim();

  const searchableText = (item) =>
    normalize(
      [
        item.title,
        item.description,
        item.type,
        item.edition,
        ...(Array.isArray(item.keywords) ? item.keywords : [])
      ].join(" ")
    );

  const documents = catalogue
    .filter(
      (item) =>
        item &&
        typeof item.title === "string" &&
        typeof item.description === "string" &&
        typeof item.href === "string"
    )
    .map((item) => ({
      ...item,
      searchText: searchableText(item)
    }))
    .sort((a, b) => {
      const dateComparison = String(b.publishedAt ?? "").localeCompare(
        String(a.publishedAt ?? "")
      );

      return dateComparison || a.title.localeCompare(b.title, "fr-CA");
    });

  const createTextElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    element.className = className;
    element.textContent = text;
    return element;
  };

  const createCard = (item) => {
    const article = documentNode("article", "document-card");
    const link = documentNode("a", "document-card__link");
    link.href = item.href;

    const metadata = documentNode("div", "document-card__meta");
    metadata.append(
      createTextElement("span", "document-card__type", item.type || "Document")
    );

    if (item.edition) {
      metadata.append(
        createTextElement("span", "document-card__edition", item.edition)
      );
    }

    const title = createTextElement("h3", "", item.title);
    const description = createTextElement(
      "p",
      "document-card__description",
      item.description
    );
    const action = createTextElement(
      "span",
      "document-card__action",
      "Consulter le document"
    );
    const arrow = createTextElement("span", "document-card__arrow", "→");
    arrow.setAttribute("aria-hidden", "true");
    action.append(arrow);

    link.append(metadata, title, description, action);
    article.append(link);

    return article;
  };

  function documentNode(tagName, className) {
    const element = document.createElement(tagName);
    element.className = className;
    return element;
  }

  const updateCount = (visible, total, hasQuery) => {
    if (hasQuery) {
      const resultLabel = visible === 1 ? "résultat" : "résultats";
      const documentLabel = total === 1 ? "document" : "documents";
      count.textContent = `${visible} ${resultLabel} sur ${total} ${documentLabel}`;
      return;
    }

    count.textContent = `${total} ${total === 1 ? "document" : "documents"}`;
  };

  const render = (query = "") => {
    const normalizedQuery = normalize(query);
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    const filteredDocuments = terms.length
      ? documents.filter((item) =>
          terms.every((term) => item.searchText.includes(term))
        )
      : documents;

    const fragment = document.createDocumentFragment();

    if (filteredDocuments.length === 0) {
      const emptyState = documentNode("p", "empty-state");
      const emptyTitle = createTextElement(
        "strong",
        "",
        terms.length
          ? "Aucun document ne correspond à votre recherche."
          : "Aucun document n’est publié pour le moment."
      );
      emptyState.append(emptyTitle);

      if (terms.length) {
        emptyState.append(
          document.createTextNode("Essayez avec moins de mots ou un terme différent.")
        );
      }

      fragment.append(emptyState);
    } else {
      filteredDocuments.forEach((item) => fragment.append(createCard(item)));
    }

    grid.replaceChildren(fragment);
    grid.setAttribute("aria-busy", "false");
    updateCount(filteredDocuments.length, documents.length, terms.length > 0);
  };

  if (searchContainer && searchInput && documents.length > 0) {
    searchContainer.hidden = false;
    searchInput.addEventListener("input", (event) => {
      render(event.currentTarget.value);
    });
  }

  render();
})();
