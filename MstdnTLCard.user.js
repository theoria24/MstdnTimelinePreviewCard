// ==UserScript==
// @name         mastodonのTLにPreviewCardを表示するやつ
// @namespace    https://github.com/theoria24/MstdnTimelinePreviewCard
// @version      0.1.3
// @description  PreviewCardをTLに表示します
// @author       theoria, hs-sh.net
// @match        https://theboss.tech/web/*
// @grant        none
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @license      MIT License
// ==/UserScript==

var INSTANCE = $(location).attr('host');

function card_formater(url, title, type, description, content, width, height) {
  if (description.length > 50) {
    description = description.substr(0, 50);
  }
  if (type == "photo") {
    return '<a href="' + url + '" class="status-card horizontal" target="_blank" rel="noopener"><div class="status-card__image"><img src="' + content + '" alt="' + title + '" class="status-card__image-image" width="' + width + '" height="' + height + '"></div><div class="status-card__content"><strong class="status-card__title" title="' + title + '">' + title + '</strong><span class="status-card__host">' + url.match(/^https?:\/\/(.*?)\//)[1] + '</span></div></a>';
  } else if (type == "link") {
    if (width > height) {
      return '<a href="' + url + '" class="status-card horizontal" target="_blank" rel="noopener"><div class="status-card__image"><img src="' + content + '" alt="' + title + '" class="status-card__image-image" width="' + width + '" height="' + height + '"></div><div class="status-card__content"><strong class="status-card__title" title="' + title + '">' + title + '</strong><span class="status-card__host">' + url.match(/^https?:\/\/(.*?)\//)[1] + '</span></div></a>';
    } else {
      return '<a href="' + url + '" class="status-card" target="_blank" rel="noopener"><div class="status-card__image"><img src="' + content + '" alt="' + title + '" class="status-card__image-image" width="' + width + '" height="' + height + '"></div><div class="status-card__content"><strong class="status-card__title" title="' + title + '">' + title + '</strong><p class="status-card__description">' + description + '</p><span class="status-card__host">' + url.match(/^https?:\/\/(.*?)\//)[1] + '</span></div></a>';
    }
  } else if (type == "video") {
    return '<div class="status-card-video">' + content + '</div>';
  }
  return '';
}

(function() {
  'use strict';
  setTimeout(function() {
    $('article:not(:has(.notification)) > div > .status__wrapper > .status:not(.carded)').each(function() {
      $(this).addClass("carded");
      var id = $(this);
      $.getJSON("https://" + INSTANCE + "/api/v1/statuses/" + id.attr('data-id') + "/card").done(function(data) {
        if (data.html != null && data.html != "") {
          $(id).find('.status__content').after(card_formater(data.url, data.title, data.type, data.description, data.html, data.width, data.height));
        } else if (data.image != null && data.image != "") {
          $(id).find('.status__content').after(card_formater(data.url, data.title, data.type, data.description, data.image, data.width, data.height));
        } // else {$(id).find('.status__content').after("None");}
      });
    });
    (new MutationObserver(function(MutationRecords, MutationObserver) {
      $('article:not(:has(.notification)) > div > .status__wrapper > .status:not(.carded)').each(function() {
        $(this).addClass("carded");
        var id = $(this);
        $.getJSON("https://" + INSTANCE + "/api/v1/statuses/" + id.attr('data-id') + "/card").done(function(data) {
          if (data.html != null && data.html != "") {
            $(id).find('.status__content').after(card_formater(data.url, data.title, data.type, data.description, data.html, data.width, data.height));
          } else if (data.image != null && data.image != "") {
            $(id).find('.status__content').after(card_formater(data.url, data.title, data.type, data.description, data.image, data.width, data.height));
          } // else {$(id).find('.status__content').after("None");}
        });
      });
    })).observe($('.columns-area').get(0), {
      childList: true,
      subtree: true,
    });
  }, 5000);
})();
