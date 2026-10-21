<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom"
                exclude-result-prefixes="atom">

  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> · Feed</title>
        <style>
          :root {
            --bg: #faf6f0; --card: #fff; --text: #2b2320; --muted: #6b5f55;
            --accent: #b34e17; --line: #e7ddd2;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #14100d; --card: #1d1815; --text: #ece4dc; --muted: #a89c90;
              --accent: #e8935a; --line: #322a24;
            }
          }
          body {
            margin: 0; padding: 2rem 1rem 4rem;
            background: var(--bg); color: var(--text);
            font-family: system-ui, "PingFang SC", "Microsoft YaHei", sans-serif;
            line-height: 1.75;
          }
          .wrap { max-width: 44rem; margin: 0 auto; }
          h1 { font-size: 1.6rem; margin: 0 0 .4rem; }
          .sub { color: var(--muted); font-size: .95rem; margin: 0 0 1.5rem; }
          .note {
            background: var(--card); border: 1px solid var(--line);
            border-left: 3px solid var(--accent); border-radius: 0 8px 8px 0;
            padding: .9rem 1.1rem; margin: 0 0 2rem; font-size: .92rem;
            color: var(--muted);
          }
          .note code { color: var(--text); word-break: break-all; }
          ol { list-style: none; padding: 0; margin: 0; }
          li {
            padding: 1.1rem 0; border-bottom: 1px solid var(--line);
          }
          li:last-child { border-bottom: none; }
          .date { color: var(--muted); font-size: .85rem; }
          h2 { font-size: 1.12rem; margin: .15rem 0 .4rem; }
          h2 a { color: var(--text); text-decoration: none; }
          h2 a:hover { color: var(--accent); text-decoration: underline; }
          p { margin: 0; font-size: .95rem; }
          a { color: var(--accent); }
          nav { margin-top: 2rem; font-size: .92rem; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1><xsl:value-of select="/rss/channel/title"/></h1>
          <p class="sub">
            <xsl:value-of select="/rss/channel/description"/>
          </p>

          <div class="note">
            This is the RSS feed for this site. Add the address below to a reader (Feedly, Inoreader, NetNewsWire
            and so on) and new notes arrive on their own.<br/>
            Feed address: <code><xsl:value-of select="concat(/rss/channel/link, 'feed.xml')"/></code><br/>
            Just here to read? <a>
              <xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>
              Back to the notes
            </a>.
          </div>

          <ol>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <div class="date">
                  <xsl:choose>
                    <xsl:when test="atom:updated">
                      <xsl:value-of select="atom:updated"/>
                    </xsl:when>
                    <xsl:otherwise>
                      <xsl:value-of select="pubDate"/>
                    </xsl:otherwise>
                  </xsl:choose>
                </div>
                <h2>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
                    <xsl:value-of select="title"/>
                  </a>
                </h2>
                <p><xsl:value-of select="description"/></p>
              </li>
            </xsl:for-each>
          </ol>

          <nav>
            <a>
              <xsl:attribute name="href"><xsl:value-of select="/rss/channel/link"/></xsl:attribute>
              ← Back to Han Hongtao's Field Notes
            </a>
          </nav>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
