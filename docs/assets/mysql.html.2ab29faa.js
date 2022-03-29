import{d as n}from"./app.ff876a20.js";import{_ as s}from"./plugin-vue_export-helper.21dcd24c.js";const a={},p=n(`<h1 id="mysql-recipe" tabindex="-1"><a class="header-anchor" href="#mysql-recipe" aria-hidden="true">#</a> MySQL Recipe</h1><h2 id="configs" tabindex="-1"><a class="header-anchor" href="#configs" aria-hidden="true">#</a> Configs</h2><p>If you chose not to add MySQL 5/8 to your monorepo during the <code>devon init</code> command, you can add it using the following recipe:</p><p><code>.devon/mysql/.devconfig.ts</code></p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> ServiceConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@evilkiwi/devon&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> config<span class="token operator">:</span> ServiceConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
    compose<span class="token operator">:</span> <span class="token punctuation">{</span>
        image<span class="token operator">:</span> <span class="token string">&#39;mysql:8&#39;</span><span class="token punctuation">,</span> <span class="token comment">// You can choose MySQL 5 or 8 here!</span>
        ports<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;33068:3306&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        environment<span class="token operator">:</span> <span class="token punctuation">{</span>
            <span class="token comment">// Change these details to ensure a</span>
            <span class="token comment">// Database &amp; User exist when the container starts</span>
            <span class="token constant">MYSQL_ROOT_PASSWORD</span><span class="token operator">:</span> <span class="token string">&#39;evilkiwi&#39;</span><span class="token punctuation">,</span>
            <span class="token constant">MYSQL_DATABASE</span><span class="token operator">:</span> <span class="token string">&#39;evilkiwi&#39;</span><span class="token punctuation">,</span>
            <span class="token constant">MYSQL_USER</span><span class="token operator">:</span> <span class="token string">&#39;evilkiwi&#39;</span><span class="token punctuation">,</span>
            <span class="token constant">MYSQL_PASSWORD</span><span class="token operator">:</span> <span class="token string">&#39;evilkiwi&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        volumes<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&#39;./.devon/.data/mysql8:/var/lib/mysql&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
        restart<span class="token operator">:</span> <span class="token string">&#39;always&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p><code>.devon.ts</code></p><div class="language-typescript ext-ts line-numbers-mode"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> DefinitionFile <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@evilkiwi/devon&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> config<span class="token operator">:</span> DefinitionFile <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
    services<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token operator">...</span>
        <span class="token punctuation">{</span>
            name<span class="token operator">:</span> <span class="token string">&#39;mysql&#39;</span><span class="token punctuation">,</span>
            path<span class="token operator">:</span> <span class="token string">&#39;.devon/mysql&#39;</span><span class="token punctuation">,</span>
            force<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// Makes sure MySQL _always_ boots</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token operator">...</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>Make sure to re-run the <code>devon switch</code> command to bring the new container up!</p></div>`,8);function e(t,o){return p}var l=s(a,[["render",e]]);export{l as default};
