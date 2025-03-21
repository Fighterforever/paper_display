const fs = require('fs');
const path = require('path');
let marked;

try {
    marked = require('marked');
} catch (error) {
    console.warn('警告: marked 模块未安装，将使用简单文本处理');
    marked = {
        parse: (text) => {
            // 简单的处理方式：将Markdown的标题转为HTML
            text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
            text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
            text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');
            text = text.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
            text = text.replace(/\*(.*)\*/gim, '<em>$1</em>');
            text = text.replace(/\n/gim, '<br>');
            return text;
        }
    };
}

// 配置
const rootDir = __dirname;
const templatePath = path.join(rootDir, 'template.html');

// 方法名称和图标映射
const methodIcons = {
    '统计方法': 'fa-chart-line',
    '图理论方法': 'fa-project-diagram',
    '机器学习方法': 'fa-brain',
    '深度学习方法': 'fa-network-wired',
    'LLM方法': 'fa-robot',
};

const subMethodIcons = {
    // 统计方法
    '概率统计模型': 'fa-chart-pie',
    '时间序列分析': 'fa-chart-area',
    '直接相关性分析': 'fa-arrows-left-right',
    
    // 图理论方法
    '依赖图和拓扑图分析': 'fa-diagram-project',
    '因果图分析': 'fa-circle-nodes',
    '知识图谱': 'fa-share-nodes',
    '贝叶斯网络': 'fa-network-wired',
    '图神经网络': 'fa-sitemap',
    
    // 机器学习方法
    '监督学习': 'fa-code-branch',
    '无监督学习': 'fa-atom',
    
    // 深度学习方法
    '自编码器架构': 'fa-code',
    '循环神经网络架构': 'fa-rotate',
    '图神经网络架构': 'fa-diagram-project',
    
    // LLM方法
    '检索增强': 'fa-search',
    'LLM自主代理': 'fa-robot',
    '微调LLM': 'fa-sliders',
};

// 方法描述
const methodDescriptions = {
    '统计方法': '基于概率统计、时间序列和相关性分析等统计学手段，对微服务系统的异常进行检测与定位',
    '图理论方法': '利用图论模型表示微服务之间的复杂依赖关系，通过图分析算法快速定位故障源',
    '机器学习方法': '结合有监督与无监督学习算法，通过大量数据训练模型，实现精准的异常检测与故障定位',
    '深度学习方法': '采用先进的深度神经网络架构，自动学习微服务系统中的复杂模式，精确识别故障根因',
    'LLM方法': '基于大型语言模型的创新方法，结合检索增强和微调技术，实现对微服务故障的智能分析',
};

// 子方法描述
const subMethodDescriptions = {
    // 统计方法
    '概率统计模型': '利用概率统计模型，如马尔可夫模型、贝叶斯网络等，对微服务系统的状态进行建模分析',
    '时间序列分析': '通过对系统监控指标的时间序列数据进行分析，发现异常趋势和模式',
    '直接相关性分析': '分析微服务间的直接相关性，通过关联规则挖掘和相关性度量发现故障根因',
    
    // 图理论方法
    '依赖图和拓扑图分析': '构建微服务间的依赖关系图和拓扑图，通过图遍历算法定位故障源',
    '因果图分析': '利用因果图分析微服务间的因果关系，发现故障的根本原因',
    '知识图谱': '建立微服务系统的知识图谱，通过语义关联分析识别故障模式',
    '贝叶斯网络': '结合概率图模型和贝叶斯推理，计算故障源的后验概率',
    '图神经网络': '使用图神经网络学习微服务系统的图结构特征，进行故障定位',
    
    // 机器学习方法
    '监督学习': '通过历史故障数据进行训练，学习故障模式和特征，用于新故障的识别和定位',
    '无监督学习': '在无标记数据的情况下，通过聚类、异常检测等技术发现系统异常',
    
    // 深度学习方法
    '自编码器架构': '利用自编码器的特征提取和重构能力，检测微服务系统中的异常模式',
    '循环神经网络架构': '使用RNN、LSTM等处理微服务系统的时序数据，识别动态故障模式',
    '图神经网络架构': '结合深度学习和图理论，在微服务依赖图上学习复杂特征进行故障定位',
    
    // LLM方法
    '检索增强': '结合大型语言模型和检索技术，增强对微服务故障日志和文档的理解能力',
    'LLM自主代理': '构建基于大型语言模型的自主代理，进行微服务故障的诊断和修复',
    '微调LLM': '针对微服务领域知识对大型语言模型进行微调，提高故障分析的专业性',
};

// 读取模板
const readTemplate = () => {
    try {
        return fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
        console.error('读取模板文件失败:', error);
        // 提供一个基本模板作为备份
        return `<!DOCTYPE html>
        <html lang="zh">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>{{TITLE}} - 微服务架构根因分析</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
            <link rel="stylesheet" href="{{ROOT_PATH}}styles.css">
        </head>
        <body>
            <header>
                <div class="container">
                    <h1>{{TITLE}}</h1>
                    <p>{{SUBTITLE}}</p>
                </div>
            </header>
            <main class="container">
                {{MAIN_CONTENT}}
            </main>
            <footer>
                <div class="container">
                    <p>© 2025 微服务架构根因分析方法</p>
                </div>
            </footer>
        </body>
        </html>`;
    }
};

// 递归创建目录
const mkdir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// 处理Markdown文件内容
const processMarkdown = (content) => {
    try {
        return marked.parse(content);
    } catch (error) {
        console.error('处理Markdown失败:', error);
        return `<p>${content}</p>`;
    }
};

// 生成面包屑导航
const generateBreadcrumbs = (paths) => {
    let html = '<li class="breadcrumb-item"><a href="ROOT_PATHindex.html">首页</a></li>';
    let currentPath = '';
    
    for (let i = 0; i < paths.length; i++) {
        currentPath += paths[i] + '/';
        const isLast = i === paths.length - 1;
        
        if (isLast) {
            html += `<li class="breadcrumb-item active" aria-current="page">${paths[i]}</li>`;
        } else {
            html += `<li class="breadcrumb-item"><a href="ROOT_PATH${currentPath}index.html">${paths[i]}</a></li>`;
        }
    }
    
    return html;
};

// 寻找目录中最合适的图片文件
const findBestImage = (dirPath) => {
    try {
        const files = fs.readdirSync(dirPath);
        
        // 优先查找PNG文件
        const pngFiles = files.filter(file => file.endsWith('.png'));
        if (pngFiles.length > 0) return path.join(dirPath, pngFiles[0]);
        
        // 其次查找JPG/JPEG文件
        const jpgFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg'));
        if (jpgFiles.length > 0) return path.join(dirPath, jpgFiles[0]);
        
        // 查找PDF文件作为替代(注意:PDF无法直接显示,但至少可以链接)
        const pdfFiles = files.filter(file => file.endsWith('.pdf'));
        if (pdfFiles.length > 0) return path.join(dirPath, pdfFiles[0]);
        
        // 没有找到图片
        return null;
    } catch (error) {
        console.error(`查找图片失败(${dirPath}):`, error);
        return null;
    }
};

// 寻找目录中最合适的MD文件
const findBestMarkdown = (dirPath) => {
    try {
        const files = fs.readdirSync(dirPath);
        
        // 查找MD文件
        const mdFiles = files.filter(file => file.endsWith('.md'));
        if (mdFiles.length > 0) return path.join(dirPath, mdFiles[0]);
        
        // 没有找到MD文件
        return null;
    } catch (error) {
        console.error(`查找Markdown失败(${dirPath}):`, error);
        return null;
    }
};

// 生成目录页面
const generateDirectoryPage = (dirPath, title, items, level) => {
    const template = readTemplate();
    const relativePath = path.relative(dirPath, rootDir).replace(/\\/g, '/');
    const rootPath = relativePath ? relativePath + '/' : '';
    
    // 面包屑导航
    const pathParts = dirPath.replace(rootDir, '').split(path.sep).filter(Boolean);
    let breadcrumbs = generateBreadcrumbs(pathParts);
    breadcrumbs = breadcrumbs.replace(/ROOT_PATH/g, rootPath);
    
    // 内容
    let content = `
    <div class="row mb-5">
        <div class="col-12 text-center" data-aos="fade-up">
            <h2 class="display-5 fw-bold">${title}</h2>
            <p class="lead text-muted">${methodDescriptions[title] || subMethodDescriptions[title] || '微服务架构中的根因分析方法'}</p>
        </div>
    </div>
    
    <div class="method-grid">
    `;
    
    items.forEach((item, index) => {
        const itemName = path.basename(item);
        const itemIcon = level === 0 ? methodIcons[itemName] : subMethodIcons[itemName] || 'fa-folder';
        const itemDescription = level === 0 ? methodDescriptions[itemName] : subMethodDescriptions[itemName] || '微服务架构中的根因分析方法';
        
        content += `
        <div class="method-item" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="method-card">
                <div class="card-body text-center p-5">
                    <div class="method-icon">
                        <i class="fas ${itemIcon}"></i>
                    </div>
                    <h3 class="fw-bold mb-3">${itemName}</h3>
                    <p class="text-muted mb-4">${itemDescription}</p>
                    <a href="${encodeURIComponent(itemName)}/index.html" class="btn btn-primary">了解更多</a>
                </div>
            </div>
        </div>`;
    });
    
    content += '</div>';
    
    // 替换模板中的占位符
    let html = template
        .replace(/{{TITLE}}/g, title)
        .replace(/{{SUBTITLE}}/g, level === 0 ? '微服务架构中的根因分析方法' : (methodDescriptions[title] || subMethodDescriptions[title] || '深入探究故障定位技术'))
        .replace(/{{BREADCRUMBS}}/g, breadcrumbs)
        .replace(/{{MAIN_CONTENT}}/g, content)
        .replace(/{{ROOT_PATH}}/g, rootPath);
    
    // 写入文件
    const outputPath = path.join(dirPath, 'index.html');
    fs.writeFileSync(outputPath, html);
    console.log(`生成目录页面: ${outputPath}`);
};

// 生成方法详情页面
const generateMethodPage = (dirPath, title, mdFile, imgFile) => {
    const template = readTemplate();
    const relativePath = path.relative(dirPath, rootDir).replace(/\\/g, '/');
    const rootPath = relativePath ? relativePath + '/' : '';
    
    // 面包屑导航
    const pathParts = dirPath.replace(rootDir, '').split(path.sep).filter(Boolean);
    let breadcrumbs = generateBreadcrumbs(pathParts);
    breadcrumbs = breadcrumbs.replace(/ROOT_PATH/g, rootPath);
    
    // 读取并处理Markdown文件
    let mdContent = '';
    if (mdFile && fs.existsSync(mdFile)) {
        try {
            const md = fs.readFileSync(mdFile, 'utf8');
            mdContent = processMarkdown(md);
        } catch (error) {
            console.error(`处理Markdown文件失败(${mdFile}):`, error);
            mdContent = '<p>无法读取方法说明文件</p>';
        }
    } else {
        mdContent = '<p class="text-center text-muted">该方法暂无详细说明文档</p>';
    }
    
    // 构建图片部分
    let imgHtml = '';
    if (imgFile && fs.existsSync(imgFile)) {
        const imgName = path.basename(imgFile);
        imgHtml = `
        <div class="sticky-diagram">
            <h2>流程图</h2>
            <div class="diagram-container">
                <img src="${imgName}" alt="${title}流程图" class="img-fluid">
            </div>
        </div>`;
    } else {
        // 创建默认的占位图
        imgHtml = `
        <div class="sticky-diagram">
            <h2>流程图</h2>
            <div class="diagram-container">
                <div class="alert alert-info" role="alert">
                    <i class="fas fa-info-circle me-2"></i> 该方法暂无流程图
                </div>
            </div>
        </div>`;
    }
    
    // 构建两栏布局内容
    let content = `
    <div class="method-detail-container">
        <div class="content-column">
            <div class="content-section">
                ${mdContent}
            </div>
        </div>
        <div class="diagram-column">
            ${imgHtml}
        </div>
    </div>`;
    
    // 替换模板中的占位符
    let html = template
        .replace(/{{TITLE}}/g, title)
        .replace(/{{SUBTITLE}}/g, '微服务架构中的根因分析方法')
        .replace(/{{BREADCRUMBS}}/g, breadcrumbs)
        .replace(/{{MAIN_CONTENT}}/g, content)
        .replace(/{{ROOT_PATH}}/g, rootPath);
    
    // 写入文件
    const outputPath = path.join(dirPath, 'index.html');
    fs.writeFileSync(outputPath, html);
    console.log(`生成方法页面: ${outputPath}`);
};

// 查找目录中的所有子目录，忽略以.开头的隐藏目录
const findSubdirectories = (dirPath) => {
    if (!fs.existsSync(dirPath)) return [];
    
    try {
        return fs.readdirSync(dirPath, { withFileTypes: true })
            .filter(item => !item.name.startsWith('.') && item.isDirectory())
            .map(item => path.join(dirPath, item.name));
    } catch (error) {
        console.error(`读取目录失败(${dirPath}):`, error);
        return [];
    }
};

// 处理具体方法的三级目录
const processMethodDirectory = (dirPath) => {
    const dirName = path.basename(dirPath);
    console.log(`处理方法目录: ${dirPath}`);
    
    // 查找子目录，可能是具体实现方法
    const subDirs = findSubdirectories(dirPath);
    
    // 如果有子目录，为每个子目录生成页面
    if (subDirs.length > 0) {
        // 生成二级目录页面
        generateDirectoryPage(dirPath, dirName, subDirs, 1);
        
        // 递归处理每个子目录
        subDirs.forEach(subDir => {
            processImplementationDirectory(subDir);
        });
    } else {
        // 没有子目录，可能本身就是最终级别
        const mdFile = findBestMarkdown(dirPath);
        const imgFile = findBestImage(dirPath);
        
        // 即使没有找到md或img也生成页面
        generateMethodPage(dirPath, dirName, mdFile, imgFile);
    }
};

// 处理具体实现方法的目录
const processImplementationDirectory = (dirPath) => {
    const dirName = path.basename(dirPath);
    console.log(`处理实现目录: ${dirPath}`);
    
    // 查找子目录，进一步细分或实现
    const subDirs = findSubdirectories(dirPath);
    
    if (subDirs.length > 0) {
        // 生成三级目录页面
        generateDirectoryPage(dirPath, dirName, subDirs, 2);
        
        // 递归处理每个子目录
        subDirs.forEach(subDir => {
            const subDirName = path.basename(subDir);
            const mdFile = findBestMarkdown(subDir);
            const imgFile = findBestImage(subDir);
            
            // 生成最终方法页面
            generateMethodPage(subDir, subDirName, mdFile, imgFile);
        });
    } else {
        // 没有子目录，直接生成方法页面
        const mdFile = findBestMarkdown(dirPath);
        const imgFile = findBestImage(dirPath);
        
        // 即使没有找到md或img也生成页面
        generateMethodPage(dirPath, dirName, mdFile, imgFile);
    }
};

// 主函数
const main = () => {
    try {
        console.log('开始生成网站页面...');
        
        // 确保styles.css存在
        if (!fs.existsSync(path.join(rootDir, 'styles.css'))) {
            console.warn('未找到styles.css，将创建基本样式');
            const basicCss = `
                body { font-family: 'Microsoft YaHei', sans-serif; }
                .container { max-width: 1200px; margin: 0 auto; padding: 0 15px; }
                header { background-color: #2563eb; color: white; padding: 2rem 0; margin-bottom: 2rem; }
                footer { text-align: center; margin-top: 2rem; padding: 1rem 0; background-color: #f1f5f9; }
            `;
            fs.writeFileSync(path.join(rootDir, 'styles.css'), basicCss);
        }
        
        // 获取所有一级方法目录
        const methodDirs = findSubdirectories(rootDir)
            .filter(dir => Object.keys(methodIcons).includes(path.basename(dir)));
        
        console.log(`找到${methodDirs.length}个方法目录`);
        
        // 处理每个方法目录
        methodDirs.forEach(dir => {
            processMethodDirectory(dir);
        });
        
        console.log('网站页面生成完成！');
    } catch (error) {
        console.error('生成页面时出错:', error);
    }
};

// 执行主函数
main(); 