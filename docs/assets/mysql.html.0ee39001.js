import{_ as n,o as s,c as a,e}from"./app.29bc771a.js";const t={},p=e(`<h1 id="mysql-recipe" tabindex="-1"><a class="header-anchor" href="#mysql-recipe" aria-hidden="true">#</a> MySQL Recipe</h1><h2 id="configs" tabindex="-1"><a class="header-anchor" href="#configs" aria-hidden="true">#</a> Configs</h2><p>If you chose not to add MySQL 5/8 to your monorepo during the <code>devon init</code> command, you can add it using the following recipe:</p><p><code>.devon/mysql/.devconfig.ts</code></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> ServiceConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@evilkiwi/devon&#39;</span><span class="token punctuation">;</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>.devon.ts</code></p><div class="language-typescript line-numbers-mode" data-ext="ts"><pre class="language-typescript"><code><span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> DefinitionFile <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@evilkiwi/devon&#39;</span><span class="token punctuation">;</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p><p>Make sure to re-run the <code>devon switch</code> command to bring the new container up!</p></div>`,8),o=[p];function i(c,l){return s(),a("div",null,o)}const u=n(t,[["render",i],["__file","mysql.html.vue"]]);export{u as default};
