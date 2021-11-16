import{_ as n,c as s,o as a,a as e}from"./app.245836a6.js";const v='{"title":"Redis Recipe","description":"Add Redis to your local dev environment using Devon","frontmatter":{"title":"Redis Recipe","head":[["meta",{"name":"description","content":"Add Redis to your local dev environment using Devon"}],["meta",{"name":"description","content":"Add Redis to your local dev environment using Devon"}]]},"headers":[{"level":2,"title":"Configs","slug":"configs"}],"relativePath":"recipes/redis/index.md","lastUpdated":1637041734800}',o={},t=e(`<h1 id="redis-recipe"><a class="header-anchor" href="#redis-recipe" aria-hidden="true">#</a> Redis Recipe</h1><h2 id="configs"><a class="header-anchor" href="#configs" aria-hidden="true">#</a> Configs</h2><p>If you chose not to add Redis to your monorepo during the <code>devon init</code> command, you can add it using the following recipe:</p><p><code>.devon/redis/.devconfig.ts</code></p><div class="language-typescript"><pre><code><span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> ServiceConfig <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@casthub/devon&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> config<span class="token operator">:</span> ServiceConfig <span class="token operator">=</span> <span class="token punctuation">{</span>
    compose<span class="token operator">:</span> <span class="token punctuation">{</span>
        image<span class="token operator">:</span> <span class="token string">&#39;redis&#39;</span><span class="token punctuation">,</span>
        ports<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&#39;62098:6379&#39;</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
        volumes<span class="token operator">:</span> <span class="token punctuation">[</span>
            <span class="token string">&#39;./.devon/.data/redis:/data&#39;</span><span class="token punctuation">,</span>
        <span class="token punctuation">]</span><span class="token punctuation">,</span>
        restart<span class="token operator">:</span> <span class="token string">&#39;always&#39;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><p><code>.devon.ts</code></p><div class="language-typescript"><pre><code><span class="token keyword">import</span> <span class="token keyword">type</span> <span class="token punctuation">{</span> DefinitionFile <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@casthub/devon&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> config<span class="token operator">:</span> DefinitionFile <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token operator">...</span>
    services<span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token operator">...</span>
        <span class="token punctuation">{</span>
            name<span class="token operator">:</span> <span class="token string">&#39;redis&#39;</span><span class="token punctuation">,</span>
            path<span class="token operator">:</span> <span class="token string">&#39;.devon/redis&#39;</span><span class="token punctuation">,</span>
            force<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// Makes sure Redis _always_ boots</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token operator">...</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>Make sure to re-run the <code>devon switch</code> command to bring the new container up!</p></div>`,8),p=[t];function c(i,r,l,d,u,k){return a(),s("div",null,p)}var m=n(o,[["render",c]]);export{v as __pageData,m as default};
